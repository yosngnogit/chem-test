/*
 * @Author: zenglinquan
 * @Date: 2022-08-03 14:02:05
 * @LastEditors: zenglinquan
 * @LastEditTime: 2022-09-23 14:26:07
 * @Description:
 */
import axios from "axios";
import { message } from "antd";
import { baseURL } from "@/config";
import { getCookie, toLogin } from "@/utils";
import { clearLoginInfo } from "@/api/login";

const instance = axios.create({
  baseURL,
  timeout: 1000 * 60 * 3,
  withCredentials: true,
});

/**
 * 请求拦截
 */
instance.interceptors.request.use(
  (config) => {
    config.headers["content-type"] = "application/json;charset=UTF-8";
    config.headers["Authorization"] = "";
    config.headers["Token"] = "";
    let url = config.url;
    if (url.indexOf("?") > -1) {
      url = url.split("?")[0];
    }

    let token = getCookie("access_token");
    let urls = [
      "/auth/login",
      "/auth/oauth/token",
      "/front/consumer/sendVerificationCode",
      "/front/consumer/checkMessageCode",
      "/front/consumer/user/register",
      "/front/consumer/user/invitationRegister",
      "/front/consumer/checkEnterpriseUsername",
    ];
    if (token && token !== "undefind" && token !== "null") {
      if (!(urls.indexOf(url) > -1)) {
        config.headers["Authorization"] = token ? "Bearer " + token : "";
        config.headers["Token"] = token || "";
      }
      if (url.indexOf("/auth/oauth/token") > -1) {
        config.headers["Authorization"] = token ? "Bearer " + token : "";
      }
      if (
        url.indexOf("/front/sso/jwt/userInfo") > -1 ||
        url.indexOf("/auth/ssoToken") > -1
      ) {
        config.headers["Authorization"] = "";
      }
    }
    // 防止缓存，GET请求默认带_t参数
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: new Date().getTime(),
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截
 */
instance.interceptors.response.use(
  (response) => {
    if (response.data.code === 401 || response.data.code === 10001) {
      clearLoginInfo()
      setTimeout(() => {
        toLogin()
      }, 500);
    }
    if (
      response.data.code !== 0 &&
      response.data.code !== 10004 &&
      response.data.code !== 10007
    ) {
      if (
        response.data.code !== "0" &&
        response.config.url.indexOf(
          "front/consumer/shoppingcart/checkCommodityPromotion"
        ) <= -1
      ) {
        message.error(response.data.message);
        return Promise.reject(response.data);
      }
    }
    return response.data;
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 10001) {
      clearLoginInfo()
      setTimeout(() => {
        toLogin()
      }, 500);
    }
    if (JSON.stringify(error.message).includes("timeout")) {
      message.error("服务器响应超时，请刷新当前页");
    } else {
      switch (error.response.status) {
        case 400:
          error.message = "错误请求";
          break;
        case 401:
          error.message = "未授权，请重新登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求错误,未找到该资源";
          break;
        case 405:
          error.message = "请求方法未允许";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器端出错";
          break;
        case 501:
          error.message = "网络未实现";
          break;
        case 502:
          error.message = "网络错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网络超时";
          break;
        case 505:
          error.message = "http版本不支持该请求";
          break;
        default:
          error.message = `网络连接错误`;
      }
      message.error(error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
