# snake-case.ts

## 文件功能概述

该文件提供了字符串和对象的大小写转换功能，支持驼峰命名（camelCase）和下划线命名（snake_case）之间的相互转换。主要用于处理不同命名规范的数据格式转换，如 API 请求/响应数据的格式转换。

## 主要函数/类详细说明

### `camelToSnake(str: string): string`
将驼峰命名转换为下划线命名。
- **参数**: `str` - 驼峰命名字符串
- **返回值**: 下划线命名字符串
- **转换规则**: 每个大写字母前添加下划线并转为小写
- **示例**:
  - `"helloWorld"` → `"hello_world"`
  - `"userID"` → `"user_i_d"`
  - `"XMLParser"` → `"x_m_l_parser"`

### `snakeToCamel(str: string): string`
将下划线命名转换为驼峰命名。
- **参数**: `str` - 下划线命名字符串
- **返回值**: 驼峰命名字符串
- **转换规则**: 下划线后的字母转为大写，移除下划线
- **示例**:
  - `"hello_world"` → `"helloWorld"`
  - `"user_id"` → `"userId"`
  - `"api_key_value"` → `"apiKeyValue"`

### `objectToSnakeCase(obj, deep?): Record<string, unknown>`
递归地将对象的所有键从驼峰命名转换为下划线命名。
- **参数**:
  - `obj`: 要转换的对象
  - `deep`: 是否深度转换嵌套对象，默认 `true`
- **返回值**: 转换后的新对象
- **处理逻辑**:
  1. 遍历对象的所有键值对
  2. 将键名通过 `camelToSnake` 转换
  3. 如果值是对象且 `deep=true`，递归转换
  4. 如果值是数组且 `deep=true`，递归转换数组中的对象元素
- **示例**:
```typescript
const input = {
  userName: "John",
  userAge: 30,
  contactInfo: {
    phoneNumber: "123-456",
    emailAddress: "john@example.com"
  },
  tags: [{ tagName: "admin" }, { tagName: "user" }]
};

objectToSnakeCase(input);
// 结果:
// {
//   user_name: "John",
//   user_age: 30,
//   contact_info: {
//     phone_number: "123-456",
//     email_address: "john@example.com"
//   },
//   tags: [{ tag_name: "admin" }, { tag_name: "user" }]
// }
```

### `objectToCamelCase(obj, deep?): Record<string, unknown>`
递归地将对象的所有键从下划线命名转换为驼峰命名。
- **参数**:
  - `obj`: 要转换的对象
  - `deep`: 是否深度转换嵌套对象，默认 `true`
- **返回值**: 转换后的新对象
- **处理逻辑**: 与 `objectToSnakeCase` 相反，使用 `snakeToCamel` 转换键名
- **示例**:
```typescript
const input = {
  user_name: "John",
  contact_info: {
    phone_number: "123-456"
  }
};

objectToCamelCase(input);
// 结果:
// {
//   userName: "John",
//   contactInfo: {
//     phoneNumber: "123-456"
//   }
// }
```

## 代码逻辑流程

### 字符串转换流程

```
camelToSnake: "helloWorld"
└── 正则 /[A-Z]/g 匹配大写字母
    ├── 找到 "W"
    ├── 替换为 "_w"
    └── 结果: "hello_world"

snakeToCamel: "hello_world"
└── 正则 /_([a-z])/g 匹配下划线+小写字母
    ├── 找到 "_w"
    ├── 替换为 "W"
    └── 结果: "helloWorld"
```

### 对象转换流程

```
objectToSnakeCase(obj)
├── 创建空结果对象
├── 遍历 obj 的每个 [key, value]
│   ├── 转换键名: snakeKey = camelToSnake(key)
│   ├── 如果 deep=true 且 value 是对象
│   │   └── 递归转换: objectToSnakeCase(value, true)
│   ├── 如果 deep=true 且 value 是数组
│   │   └── 遍历数组，对每个对象元素递归转换
│   └── 设置结果: result[snakeKey] = 转换后的值
└── 返回 result
```

## 使用示例

```typescript
import { 
  camelToSnake, 
  snakeToCamel, 
  objectToSnakeCase, 
  objectToCamelCase 
} from './snake-case';

// 字符串转换
console.log(camelToSnake("userID"));        // "user_i_d"
console.log(snakeToCamel("user_id"));       // "userId"

// API 请求数据转换（发送到后端）
const frontendData = {
  firstName: "John",
  lastName: "Doe",
  emailAddress: "john@example.com"
};

const backendData = objectToSnakeCase(frontendData);
// {
//   first_name: "John",
//   last_name: "Doe",
//   email_address: "john@example.com"
// }

// API 响应数据转换（从后端接收）
const apiResponse = {
  user_id: 123,
  created_at: "2024-01-01",
  profile_data: {
    display_name: "John"
  }
};

const frontendFormat = objectToCamelCase(apiResponse);
// {
//   userId: 123,
//   createdAt: "2024-01-01",
//   profileData: {
//     displayName: "John"
//   }
// }

// 浅转换（不处理嵌套对象）
const shallow = objectToSnakeCase(frontendData, false);
// 只转换顶层键，嵌套对象保持不变
```

## 依赖关系

- `./deep-merge`: 导入 `isPlainObject` 函数用于检测纯对象

## 注意事项

1. **连续大写处理**: `camelToSnake` 对每个大写字母单独处理，所以 `userID` 会变成 `user_i_d` 而不是 `user_id`
2. **纯对象检测**: 使用 `isPlainObject` 确保只处理普通对象，不处理数组、Date、RegExp 等
3. **数组处理**: 数组中的对象元素会被递归转换，但基本类型元素保持不变
4. **深度控制**: 通过 `deep` 参数可以控制是否递归处理嵌套结构
5. **新对象创建**: 所有转换函数都返回新对象，不会修改原对象
6. **性能考虑**: 深度转换大型嵌套对象时可能有性能开销
