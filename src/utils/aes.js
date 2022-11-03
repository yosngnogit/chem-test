import CryptoJS from 'crypto-js';

//约定密钥(与后端密钥保持一致)
const key = CryptoJS.enc.Utf8.parse("4829593032910210");// 密钥16位长度字符   内容可自定义
//  const IV = CryptoJS.enc.Utf8.parse("4829593032910210");//  密钥偏移量    16位长度字符

/**
* AES对称加密 （CBC模式，需要偏移量）
* @param {Object} params 明文参数
*/
export const encrypt = (params) => {
    //明文参数   
    const str = CryptoJS.enc.Utf8.parse(params);
    //加密
    const encryptedData = CryptoJS.AES.encrypt(str, key, {
        iv: key,
        mode: CryptoJS.mode.CBC, //AES加密模式  
        padding: CryptoJS.pad.Pkcs7 //填充方式
    });
    return CryptoJS.enc.Base64.stringify(encryptedData.ciphertext); //返回base64格式密文
}

/**
 * AES对称解密
 * @param {Object} params 加密参数
 */

export const decrypt = (params) => {
 
    if (params) {
        //base64格式密文转换
        const base64 = CryptoJS.enc.Base64.parse(params);
        const str = CryptoJS.enc.Base64.stringify(base64);
        //解密
        const decryptedData = CryptoJS.AES.decrypt(str, key, {
            iv: key,
            mode: CryptoJS.mode.CBC, //AES加密模式  
            padding: CryptoJS.pad.Pkcs7 //填充方式
        });
        return CryptoJS.enc.Utf8.stringify(decryptedData).toString(); //返回明文
    }
    return params
}