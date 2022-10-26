/*
 * @Author: zly
 * @Date: 2021-09-17 09:32:00
 * @LastEditTime: 2021-09-17 21:42:27
 * @LastEditors: zly
 * @Description: 获取登录信息
 */
export const getEnvConfig = () => {
  const hostStr = window.location.hostname
  let env = ''
  let domain = ''
  if (
    process.env.NODE_ENV === 'development' &&
    hostStr.indexOf('localhost') !== -1
  ) {
    env = 'local.'
    domain = 'localhost'
  } else if (
    process.env.NODE_ENV === 'development' &&
    hostStr.indexOf('localhost') !== -1
  ) {
    env = 'local.'
    domain = `${window.location.hostname}`
  } else if (hostStr.indexOf('supcon') !== -1) {
    env = `${hostStr.split('.')[0]}.`
    domain = hostStr.split('.').slice(1).join('.')
  } else {
    env = ''
    domain = hostStr
  }

  return {
    env: env,
    domain: domain
  }
}
