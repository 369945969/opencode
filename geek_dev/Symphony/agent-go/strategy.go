package main

import (
	"fmt"
)

// StrategyNode 定义策略图中的一个节点，支持 I/O 映射配置
type StrategyNode struct {
	ID         int
	Name       string
	Prompt     string // 该节点的 Prompt 模板（包含 %s 占位符）
	InputPath  string // 期望从上一个节点输出 JSON 中提取的 Key
	OutputPath string // 该节点输出 JSON 中包含核心结果的 Key
}

// StrategyResponse 策略模块返回的结果
type StrategyResponse struct {
	Prompt     string `json:"prompt"`      // 下一步执行的 Prompt
	Node       int    `json:"node"`        // 下一个节点 ID
	NodeName   string `json:"node_name"`   // 下一个节点名称
	InputPath  string `json:"input_path"`  // 输入映射配置
	OutputPath string `json:"output_path"` // 输出映射配置
}

// TRIZ 策略节点常量
const (
	NodeUserQuestion  = 0
	NodeTitleGen      = 1
	NodeRCA           = 2
	NodeToolRec       = 3
	NodeToolExec      = 4
	NodeSummary       = 5
	NodeInnovationDir = 10 // 创新方向节点（虚拟节点，用于展示推导链条）
)

const (
	// TitleGenerationPrompt 标题生成 Prompt 模板
	TitleGenerationPrompt = `请根据以下任务描述，生成一个简洁的标题（限制20个字以内）。直接返回标题内容，不要包含任何其他文字、标点符号或解释：

%s`

	// RootCauseAnalysisPrompt 根因分析 Prompt 模板
	RootCauseAnalysisPrompt = `你是一个TRIZ专家，擅长使用TRIZ理论进行根因分析。

#输出要求：
必须严格按照以下 JSON 格式返回：
{
  "root_cause_analysis": "分析详情",
  "root_cause_diagram": "mermaid...",
  "innovation_directions": [
    { "innovation_direction": "方向描述", "root_cause_node": "节点" }
  ]
}

#输入： 
业务问题或创新方向：%s`

	// ToolRecommendationPrompt 工具推荐 Prompt 模板
	ToolRecommendationPrompt = `# 角色：TRIZ 专家
# 任务：根据以下特定的创新方向推荐解题工具。

# 输出要求：
必须严格按照以下 JSON 格式返回：
{
  "recommended_tool": "matrix39 | matrix24 | iwb | 5why",
  "reason": "推荐理由"
}

# 输入创新方向：
%s`

	// ContradictionMatrixPrompt 矛盾矩阵分析 Prompt 模板
	ContradictionMatrixPrompt = `# 角色：TRIZ 矛盾矩阵专家
# 任务：针对以下创新方向进行技术矛盾分析。

# 输出要求：
必须严格按照以下 JSON 格式返回：
{
  "system_type": "hardware | software",
  "parameters": { "improving": "...", "worsening": "..." },
  "inventive_principles": [...],
  "innovation_solutions": [...]
}

# 输入创新方向：
%s`
)

// StrategyManager 策略编排管理器
type StrategyManager struct {
	Graph map[int]StrategyNode
}

// NewStrategyManager 创建一个新的策略管理器
func NewStrategyManager() *StrategyManager {
	sm := &StrategyManager{
		Graph: make(map[int]StrategyNode),
	}
	// 初始化策略图及其 I/O 映射关系
	sm.Graph[NodeTitleGen] = StrategyNode{
		ID:         NodeTitleGen,
		Name:       "标题生成",
		Prompt:     TitleGenerationPrompt,
		InputPath:  "",
		OutputPath: "title",
	}
	sm.Graph[NodeRCA] = StrategyNode{
		ID:         NodeRCA,
		Name:       "根因分析",
		Prompt:     RootCauseAnalysisPrompt,
		InputPath:  "",                      // 依然基于原始输入
		OutputPath: "innovation_directions", // RCA 产生创新方向列表
	}
	sm.Graph[NodeToolRec] = StrategyNode{
		ID:         NodeToolRec,
		Name:       "工具推荐",
		Prompt:     ToolRecommendationPrompt,
		InputPath:  "innovation_direction", // 从 RCA 列表的某项提取方向
		OutputPath: "recommended_tool",     // 输出推荐工具
	}
	sm.Graph[NodeToolExec] = StrategyNode{
		ID:         NodeToolExec,
		Name:       "矛盾矩阵分析",
		Prompt:     ContradictionMatrixPrompt,
		InputPath:  "innovation_direction", // 依然基于该方向分析
		OutputPath: "innovation_solutions", // 输出最终方案
	}
	sm.Graph[NodeSummary] = StrategyNode{
		ID:         NodeSummary,
		Name:       "创新点子",
		Prompt:     "请基于以上分析，生成 3-5 个具体的创新点子方案。",
		InputPath:  "",
		OutputPath: "",
	}

	return sm
}

// DecideNext 根据当前上下文决定下一步动作
func (s *StrategyManager) DecideNext(input string, agent *AgentStatus) (*StrategyResponse, error) {
	if agent.Project != "TRIZ" {
		return &StrategyResponse{Prompt: input, Node: agent.Node, NodeName: agent.NodeName}, nil
	}

	switch agent.Node {
	case NodeUserQuestion:
		node := s.Graph[NodeTitleGen]
		return &StrategyResponse{
			Prompt:     fmt.Sprintf(node.Prompt, input),
			Node:       node.ID,
			NodeName:   node.Name,
			InputPath:  node.InputPath,
			OutputPath: node.OutputPath,
		}, nil

	case NodeTitleGen:
		node := s.Graph[NodeRCA]
		// 获取原始输入（即第一个用户消息）
		originalInput := ""
		if len(agent.Messages) > 0 {
			for _, m := range agent.Messages {
				if m.Role == "user" && !m.IsInternal {
					originalInput = m.Content
					break
				}
			}
		}
		if originalInput == "" {
			originalInput = input
		}
		return &StrategyResponse{
			Prompt:     fmt.Sprintf(node.Prompt, originalInput),
			Node:       node.ID,
			NodeName:   node.Name,
			InputPath:  node.InputPath,
			OutputPath: node.OutputPath,
		}, nil

	case NodeRCA:
		if len(agent.PendingDirections) > 0 {
			node := s.Graph[NodeToolRec]
			currentDir := agent.PendingDirections[agent.CurrentDirIndex]
			return &StrategyResponse{
				Prompt:     fmt.Sprintf(node.Prompt, currentDir),
				Node:       node.ID,
				NodeName:   fmt.Sprintf("%s (方向 %d)", node.Name, agent.CurrentDirIndex+1),
				InputPath:  node.InputPath,
				OutputPath: node.OutputPath,
			}, nil
		}
		return nil, fmt.Errorf("无创新方向可分析")

	case NodeToolRec:
		node := s.Graph[NodeToolExec]
		currentDir := agent.PendingDirections[agent.CurrentDirIndex]
		return &StrategyResponse{
			Prompt:     fmt.Sprintf(node.Prompt, currentDir),
			Node:       node.ID,
			NodeName:   fmt.Sprintf("%s (方向 %d)", node.Name, agent.CurrentDirIndex+1),
			InputPath:  node.InputPath,
			OutputPath: node.OutputPath,
		}, nil

	case NodeToolExec:
		if agent.CurrentDirIndex+1 < len(agent.PendingDirections) {
			node := s.Graph[NodeToolRec]
			nextDir := agent.PendingDirections[agent.CurrentDirIndex+1]
			return &StrategyResponse{
				Prompt:     fmt.Sprintf(node.Prompt, nextDir),
				Node:       node.ID,
				NodeName:   fmt.Sprintf("%s (方向 %d)", node.Name, agent.CurrentDirIndex+2),
				InputPath:  node.InputPath,
				OutputPath: node.OutputPath,
			}, nil
		}
		node := s.Graph[NodeSummary]
		return &StrategyResponse{
			Prompt:     node.Prompt,
			Node:       node.ID,
			NodeName:   node.Name,
			InputPath:  node.InputPath,
			OutputPath: node.OutputPath,
		}, nil
	}

	return &StrategyResponse{Prompt: input, Node: agent.Node, NodeName: agent.NodeName}, nil
}
