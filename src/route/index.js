import dynamicRoute from "./dynamicRoute";

const routes = [
  {
    path: "/",
    showHeader: false,
    component: dynamicRoute({
      component: () => import("../page/index"),
    }),
  },
  {
    path: "/login",
    name: "login",
    showHeader: false,
    component: dynamicRoute({
      component: () => import("../page/login"),
    }),
  },
  // 忘记密码
  

  // 报告页
  {
    path: "/report",
    name: "report",
    component: dynamicRoute({
      component: () => import("../page/report"),
    }),
  },
  // 个人中心
  {
    path: "/personalCenter",
    name: "personalCenter",
    component: dynamicRoute({
      component: () => import("../page/personalCenter"),
    }),
  },
  // 个人中心--基本信息
  {
    path: "/personalInfo",
    name: "personalInfo",
    component: dynamicRoute({
      component: () => import("../page/personalCenter/component/personalInfo"),
    }),
  },
  // 个人中心--修改密码

  {
    path: "/changePassword",
    name: "changePassword",
    component: dynamicRoute({
      component: () => import("../page/personalCenter/component/changePassword"),
    }),
  }
];
export default routes;
