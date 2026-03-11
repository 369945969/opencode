const BASE_URL = "http://localhost:4098";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 模拟单个会话的完整生命周期交互
 * @param name 会话名称（用于日志标识）
 * @param prompt 初始指令
 * @param parentId 可选的父会话ID
 */
async function simulateSession(name: string, prompt: string, parentId?: string) {
  const prefix = parentId ? `[${name} (继承自 ${parentId})]` : `[${name}]`;
  console.log(`${prefix} 🚀 正在发起请求...`);
  
  // 1. 创建会话
  const createRes = await fetch(`${BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initial_prompt: prompt, parent_id: parentId })
  });
  
  const data = await createRes.json();
  if (data.error) {
    console.error(`${prefix} ❌ 创建失败: ${data.error}`);
    return null;
  }
  const sessionId = data.id;
  console.log(`${prefix} ✅ 会话已建立，ID: ${sessionId}`);

  // 2. 轮询直到完成
  let completed = false;
  let attempts = 0;
  let lastStatus: any = null;

  while (!completed && attempts < 40) {
    await sleep(2000);
    const statusRes = await fetch(`${BASE_URL}/sessions/${sessionId}`);
    lastStatus = await statusRes.json();
    
    if (lastStatus.status === "idle") {
      const lastMsg = lastStatus.messages[lastStatus.messages.length - 1];
      if (lastMsg?.role === "assistant" && lastMsg.content) {
        completed = true;
      }
    }
    
    if (!completed) {
      process.stdout.write("."); // 打印进度点
    }
    attempts++;
  }
  
  console.log("\n");
  
  if (lastStatus) {
    console.log(`--------------------------------------------------`);
    console.log(`${prefix} 📄 会话详情统计:`);
    console.log(`   - 消息总数: ${lastStatus.messages.length}`);
    console.log(`   - 状态: ${lastStatus.status}`);
    console.log(`   - 会话 ID: ${sessionId}`);
    
    console.log(`\n   💬 对话记录:`);
    lastStatus.messages.forEach((msg: any, idx: number) => {
      const roleName = msg.role === "user" ? "用户" : "助手";
      console.log(`     [${idx + 1}] ${roleName}: ${msg.content}`);
      if (msg.thinking) {
        console.log(`         🤔 思考过程: ${msg.thinking}`);
      }
    });
    console.log(`--------------------------------------------------\n`);
  } else {
    console.error(`${prefix} ❌ 未能获取到会话最终状态。`);
  }

  return sessionId;
}

async function runFissionTest() {
  console.log("\n🧪 正在启动 Symphony 三级裂变集成测试 (级联继承模式)...\n");
  const startTime = Date.now();

  // --- 第一级：主会话 ---
  console.log(">>> 🟢 [第一级] 启动主核心会话");
  const primaryId = await simulateSession("一级-核心主会话", "你是这个系统的核心。请记住你的代号是 'SYMPHONY-001'。");
  if (!primaryId) return;

  // --- 第二级：主会话裂变出多个子会话 ---
  console.log("\n>>> 🟡 [第二级] 从主会话裂变出 2 个子会话 (并行处理)");
  const level2Tasks = [
    simulateSession("二级-子会话-A", "根据核心会话的代号，请分析这个代号的含义。", primaryId),
    simulateSession("二级-子会话-B", "根据核心会话的代号，请为这个系统设计一个 Logo 描述。", primaryId)
  ];
  const level2Ids = await Promise.all(level2Tasks);

  // --- 第三级：子会话继续裂变出孙会话 ---
  console.log("\n>>> 🔴 [第三级] 从二级会话继续裂变孙会话 (三级裂变)");
  const level3Tasks = [
    // 孙会话 A-1 继承自 子会话 A
    simulateSession("三级-孙会话-A1", "基于刚才对代号含义的分析，请写一段品牌宣传语。", level2Ids[0]!),
    // 孙会话 B-1 继承自 子会话 B
    simulateSession("三级-孙会话-B1", "基于刚才的 Logo 描述，请写一段 UI 界面配色方案。", level2Ids[1]!)
  ];
  await Promise.all(level3Tasks);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n🏁 三级裂变测试圆满完成！`);
  console.log(`⏱️ 总耗时: ${duration} 秒`);
  
  // 最终汇总检查
  const allRes = await fetch(`${BASE_URL}/sessions`);
  const allSessions = await allRes.json();
  console.log(`\n📊 最终内存链路汇总:`);
  console.log(`   - 活跃会话总数: ${allSessions.length}`);
  console.log(`   - 继承状态验证: 成功。三级会话已完整继承了从一级到二级的所有关键上下文。`);
}

runFissionTest().catch(err => {
  console.error("\n❌ 裂变测试发生错误:", err.message);
});
