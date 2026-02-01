# index.ts

## 文件信息

- **路径**: src/hooks/question-label-truncator/index.ts
- **目录**: src/hooks/question-label-truncator
- **行数**: 62

## 文件功能

这是模块的入口文件,统一导出本模块的所有公共 API。

## 接口定义

### QuestionOption

- **定义位置**: 第3行
- **属性**: label, abel, bel, el, l, description, escription, scription, cription, ription

### Question

- **定义位置**: 第8行
- **属性**: question, uestion, estion, stion, tion, ion, on, n, header, eader

### AskUserQuestionArgs

- **定义位置**: 第15行
- **属性**: questions, uestions, estions, stions, tions, ions, ons, ns, s

## 函数定义

### truncateLabel()

- **定义位置**: 第19行
- **参数**: `label: string, maxLength: number = MAX_LABEL_LENGTH`
- **返回值**: `string`

### truncateQuestionLabels()

- **定义位置**: 第26行
- **参数**: `args: AskUserQuestionArgs`
- **返回值**: `AskUserQuestionArgs`

### createQuestionLabelTruncatorHook()

- **定义位置**: 第43行

## 常量定义

### MAX_LABEL_LENGTH

- **定义位置**: 第1行
- **值**: `30`

## 代码统计

- 接口数量: 3
- 类数量: 0
- 函数数量: 3
- 常量数量: 1
- 类型定义数量: 0
- 导入模块数量: 0

