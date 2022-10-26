import url from 'url';
import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();

history.listen(({ location, action }) => {
  // console.log(location, action);
  window.location.reload()
})

export function toLogin() {
  window.loginPreviousHref = window.location.href
  window.location.pathname = '/login'
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : `${val}`;
}

export function query() {
  const urlInfo = url.parse(window.location.href, true).query;
  for (const key in urlInfo) {
    if (urlInfo[key] instanceof Array) {
      urlInfo[key] = urlInfo[key][0];
    }
  }
  return urlInfo;
}

export function setCookie(name, value) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString();
}

export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  // eslint-disable-next-line no-cond-assign
  return (arr = document.cookie.match(reg)) ? decodeURIComponent(arr[2]) : null;
}

export function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

export function clearCookie(name) {
  let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (var i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
      document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
      document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
    }
  }
}

export const transformIndex = (index) => {
  index = index + ''
  let indexList = index.split('')
  let str = ''
  const chineseIndexList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  indexList.forEach((item, index) => {
    str += chineseIndexList[item]
  })
  return str
}

export function replace(str) {
  window.history.replaceState("", "", `${window.location.origin + window.location.pathname}${str}`)
}

const formatToHump = (value) => {
  return value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
}

// 字符串驼峰转下划线
const formatToLine = (value) => {
  return value.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export function formatHumpLineTransfer(data, type = 'hump') {
  let hump = ''
  // 转换对象中的每一个键值为驼峰的递归
  const formatTransferKey = (data) => {
    if (data instanceof Array) {
      data.forEach(item => formatTransferKey(item))
    } else if (data instanceof Object) {
      for (const key in data) {
        hump = type === 'hump' ? formatToHump(key) : formatToLine(key)
        data[hump] = data[key]
        if (key !== hump) {
          delete data[key]
        }
        if (data[hump] instanceof Object) {
          formatTransferKey(data[hump])
        }
      }
    } else if (typeof data === 'string') {
      data = type === 'hump' ? formatToHump(data) : formatToLine(data)
    }
  }
  formatTransferKey(data)
  return data
}
// 对象中undefined转''
export function undefinedToStr(source) {
  let newObj = { ...source };
  for (let key in newObj) {
    if (newObj.hasOwnProperty(key) && newObj[key] === undefined) {
      newObj[key] = '';
    }
  }
  return newObj;
};
export function getCurrentTime() {
  //获取当前时间并打印
  let timeStr = ''
  let yy = new Date().getFullYear();
  let mm = new Date().getMonth() + 1;
  let dd = new Date().getDate();
  let hh = new Date().getHours();
  let mf =
    new Date().getMinutes() < 10
      ? "0" + new Date().getMinutes()
      : new Date().getMinutes();
  let ss =
    new Date().getSeconds() < 10
      ? "0" + new Date().getSeconds()
      : new Date().getSeconds();
  timeStr = yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
  return timeStr
}

// 是否需要登录
export const linkAddrMap = {
  knowledge: true,
}

export const likeUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAaCAYAAACkVDyJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjg3NjIwMjY5RDQ3MTFFOTgzRkZBRUExNDk3MjlDMzIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjg3NjIwMjc5RDQ3MTFFOTgzRkZBRUExNDk3MjlDMzIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGODc2MjAyNDlENDcxMUU5ODNGRkFFQTE0OTcyOUMzMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGODc2MjAyNTlENDcxMUU5ODNGRkFFQTE0OTcyOUMzMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvkiQagAAAMySURBVHjavFVdSJNRGH7P3NLcnG3t23Cbugryr9Cl2DATSgkLL7wQCfpDwm6CSrqQlAixgm4quiy6COomuvAiqMgowmSZFkajH6w0v6n7aZtzs+mmp50z97HPzW1m84GPc96dd+9zzvue87zIsjUPlmNiSwlW/zRxtjddDK7yKtD0P0cQA2zpHqw0vYMNgXlqBwRCsBSUgebzYJS/INIwb9fj4MAjIxDPeQkZmWL7kVOY21hdI/XXDr/hyAiEiwFCRv3N1QdxTEIrk4s13z6EiA11ZEDhL9B1DSbzCuma4sFtsDadwKyhFqt7e0L+JZU8f/KxOwx0TdP3BIJzzCNkK/djpW08lL62DtAYe3mpEF5qRzm/viDnyTPUVj66B1rjCzqf6+wGjWkgKnXaT0bkaj0XnoOtuYWSoqUaUoMElN29FbNOYcx1dOP0qxfDZlxfAlICkpWwPxpqPo61g6/Aka0E+bQ1YQCC4M6xWK0CUdeFpPynJXKc7XGQUoAg2/Se/uivrYdksenOTZQsGYHvQAMdFwbe0pTiZNOzRuCZjVL+s0g1Mn2e9SWczZCAgKjIesErY0DgLN4VkqfyGpwqIla/N/QGd1fx32EKLw4Xn9bQXFgOS+N/PyVbVIGXdBcilSYlp5xp68RZN66AP00EogU/4om3pfHocuI1g5BROTzbHt0tVD33UbgjOKXMmkkdUgWNwVbXg+T6ZRSzH5KOMC2WgcxtAza38J9Jp1Q6LHfbwawrBm3fU16JEMb8uB5fAOz6nThzfjZIWgBlL58hAUpcVuu2fF5JbHI1FA30R/03SmkkGUIIkiEiCNrxr/Cxeh+OCJbw+v+QqMCqyAXGMRFzo1EnjDzpVIUeS/+4wSbLAcY5meiYeFSsBJ3XCoqR0RWzsqKWkpMGyZBLIidkiW4vXductgDMyFjcEsQVb+X3McgfGkK+9EwusPdYK0fsPNSEw2SOHB1kuX+jROVeMaXLL4RDlY/llrFQx1eoQeSbBbHHRW1bqQGYYSMKbzIekm5PQTJkq6gJdXz7BEfmbGjmyJLBqvohM/gazRxugUVBGpA0+0+fB9njh6uSwr8CDABTOzchsHUxbQAAAABJRU5ErkJggg==';

export const notLikeUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAaCAYAAACkVDyJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTA1Mzk1MTc5RDQ3MTFFOUIyQTZEMUI0QzVFOTI5MkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTA1Mzk1MTg5RDQ3MTFFOUIyQTZEMUI0QzVFOTI5MkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFMDUzOTUxNTlENDcxMUU5QjJBNkQxQjRDNUU5MjkyRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFMDUzOTUxNjlENDcxMUU5QjJBNkQxQjRDNUU5MjkyRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiCR1XQAAAQYSURBVHjatFYNTNRlGP+9fw44jiP5VMBAwesDxS5XulLQy8rKWXNhuTULtrIUxJlbW0Wtub6XrhXT9CRaNZo4m7ml5scYEnRq5LVCMwTxgzoDjC+P77u353np2CEHR8k9t7v/3f+e5/d7n//7vL/nEVJKeFutowNfVdTLY6ev4M/WLhhCdEidEoFH5yYh657pIiIseJh/U3sPSqvOy+/sf+BS8zW43BJJseF40JyIVYtMIj4ybJi/8BDy5f29v0jrkd8x4HIjSNMweZJeATS1dyuf+CgDtuTMQ2baFMG/99guyDd2nUJnd7/6PzHaQLESzR09YFxDqA4FWWY8bTGJEYT5RcflvpMXoQ8OwsuPm5F173QxyTCYTePVLrn90G8oqTgPQaHWtQtwkbLZVGpHGIG+sOQ2ZFtuETERoUNZl9BTKjxwRi1+42Pp2LBslhgi3Hm0Vr65245pcUYFlnZzpIAP+7GuRT63rRJdvQPoG3CTfzg+X78IKZONPv2r61tkrtWGv9q68dm6TCyenSDQ5uxFWv7XMmn1LnnyXLPkBYz1rr/SIc0b90rL6wfk35298Od/7LRDYS98bb90ud3QlVY2yGs9/Vhy51TMNcX6XKm3UQGJT3MzZRztb5QxxJ87Fs6MF5b0BFle40DZrw6pldEXticXpGK8dteMGJEcGy7G60/Vqq5MqtXRMWCbQStHgMwUP4h9jri0NmefOgLJVACBMi7GYJ2GVuLSov/dB00ELEF1lAS9oo2h0JKJnavncoszYISM3TfgAu07tPvSE9TNg/ZGGSjCb6svK+z770iExorC6vJleR16+10TTsaYXxB2AskiHQ+hsbg++8CtJF9OfLT/zIRn+TFhOqgJvLR8NkKpcDS+mffITNJBPXYcPqu6xURZzaVW+cmhs5iVFKU6jSpO/jDqdXh31d3oJ31cs71KOkkrb9Q6qIOwjgZpApupw3gOgeZxeHjOVPGMxQQWgnU7bZLb0v81blF5Vpu80NSJghVmytCrGXgLLWf41IflSmxfLD4h3W7pV5yvf3MML5gxCkqqRzSDEQHcTJe+dVgFbCg+rhR+vGS84DzrDyp29bZKn7E+A9u7+rDsnSMqcO2OKslA/sh6qPxzCitUDNfBaDGjAnCmy987qgAYqJsKaTRf1uMVH5Qp38H9H32B4vohytu4s2cXfi9P1DbBnBKD4rwMEXeTfpgPjxo55EONGU/MT8Hm7HliLFkek1ApBT2a9UU2efBUoxqSinIzkJ4cpSBpspP5RTaV4ZqHbserWWa/HcAvoWeie3vPz2qiYxlcmZGqHvk3NHRxl9m0cs6wyeyGCT1WWtVApf6TUn62yPAQbH1+/tDYOOGEbPaGq3LLvhoYaSB+hcZJmtz+UyP9R4ABACET/mSNAQZ5AAAAAElFTkSuQmCC';