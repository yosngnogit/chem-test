
// 大于0的正整数positive integer
export const positiveIntegerReg = /^[1-9]([0-9])*$/

// 正数类型,小数点后两位(厂区面积)
export const positiveIntegerRegPoint = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;

// 手机号
export const phoneReg = /^1[3456789]\d{9}$/

// 传真 固话
export const faxReg = /^(\d{3,4}[-\\s]?)?\d{7,8}$/

// 手机号 固话
export const tellReg = /^(((\d{3,4}[-\\s]?)?\d{7,8})|(1[3456789]\d{9}))$/

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

// 身份证号
export const idCardReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
// 护照
export const passportReg = /^([a-zA-z]|[0-9]){5,17}$/
// 港澳通行证
export const cardHKMacaoReg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/
// 台湾通行证
export const cardTaiwanRge = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/
// 外国人永久居住证
export const cardForeignerPermanentReg = /^[A-Z]{3}\d{6}(?:0[1-9]|1[021])(?:0[1-9]|[21]\d|3[10])\d{2}$/

//生产经营许可证... 数字或数字与大写英文字母正则
export const cardNumberRge = /^[1-9][A-Z0-9]+$/
