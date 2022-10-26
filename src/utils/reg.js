
// 大于0的正整数positive integer
export const positiveIntegerReg = /^[1-9]([0-9])*$/

// 手机号
export const phoneReg = /^1[3456789]\d{9}$/

// 传真 固话
export const faxReg = /^(\d{3,4}[-\\s]?)?\d{7,8}$/

// 手机号 固话
export const tellReg = /^(((\d{3,4}[-\\s]?)?\d{7,8})|(1[3456789]\d{9}))$/

// 身份证号
export const idCardReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/

// 密码规则 6-16位大小写数字加特殊符号
export const pwdReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,16}$/

// 必须以字母或者下划线开头
export const startWithoutNumber = /^[a-zA-Z_]([a-zA-Z0-9_]+)?$/

// 正整数
export const intReg = /^\+?[1-9][0-9]*$/

// 税号
export const taxReg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/

// 统一社会信用代码
export const USCCReg = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g

