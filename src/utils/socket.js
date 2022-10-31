import { baseURL } from '@/config'

function p(s) {
  return s < 10 ? '0' + s : s;
}

const getNowTime = () => {
  const myDate = new Date();
  //获取当前年
  const year = myDate.getFullYear();
  //获取当前月
  const month = myDate.getMonth() + 1;
  //获取当前日
  const date = myDate.getDate();
  const h = myDate.getHours();       //获取当前小时数(0-23)
  const m = myDate.getMinutes();     //获取当前分钟数(0-59)
  const s = myDate.getSeconds();
  return year + '-' + p(month) + "-" + p(date) + " " + p(h) + ':' + p(m) + ":" + p(s);
}

var lockReconnect = false;//避免重复连接
var reconnectTimer = null;

const heartCheck = {
  timeout: 10 * 1000,
  timer: null,
  servertimer: null,
  start: function (ws, str) {
    console.log(getNowTime() + " Socket 心跳检测");
    const self = this;
    this.timer && clearTimeout(this.timer);
    this.servertimer && clearTimeout(this.servertimer);
    this.timer = setTimeout(function () {
      console.log(getNowTime() + ' Socket 连接重试');
      str && ws.send(str.replace('/', '_'));
      self.servertimer = setTimeout(function () {
        console.log(ws);
        ws.close();
      }, self.timeout);
    }, this.timeout)
  }
}

const reconnect = (str) => {
  if (lockReconnect) {
    return;
  };
  lockReconnect = true;
  reconnectTimer && clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(function () {
    createWebSocket(str);
    lockReconnect = false;
  }, heartCheck.timeout);
}

const init = (ws, str) => {
  ws.onclose = function () {
    console.log(getNowTime() + " Socket已关闭");
  };
  ws.onerror = function () {
    console.log(getNowTime() + ' 发生异常了');
    reconnect(str);
  };
  ws.onopen = function () {
    console.log(getNowTime() + " Socket 已打开");
    ws.send("连接成功");
    //心跳检测重置
    heartCheck.start(ws);
  };
  ws.onmessage = function (event) {
    console.log(getNowTime() + ' 接收到消息:' + event.data);
    heartCheck.start(ws, str);
  }
}

export const createWebSocket = (str) => {
  if (typeof (WebSocket) == "undefined") {
    console.log("您的浏览器不支持WebSocket");
    return;
  }
  let wsUrl = `${baseURL}/websocket/${str}`;
  if (wsUrl.indexOf("https") >= 0) {//如果是https  webSocket 需要遵守wss协议所以这里判断如果是https socket
    wsUrl = wsUrl.replace("https", "wss");
  } else {
    wsUrl = wsUrl.replace("http", "ws");
  }
  const ws = new WebSocket(wsUrl);
  try {
    init(ws, str);
  } catch (e) {
    console.log('catch' + e);
    reconnect(str);
  }
  return ws;
}