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
  {
    path: "/answerEntrance",
    name: "answerEntrance",
    component: dynamicRoute({
      component: () => import("../page/answerEntrance"),
    }),
  },
  // 答题详情
  {
    path: "/answerDetail",
    name: "answerDetail",
    component: dynamicRoute({
      component: () => import("../page/answerDetail"),
    }),
  },
  // 企业信息入口
  {
    path: "/baseInfo",
    name: "baseInfo",
    component: dynamicRoute({
      component: () => import("../page/baseInfo"),
    }),
  },
  // 完善企业信息
  {
    path: "/baseInfoDetails",
    name: "baseInfoDetails",
    component: dynamicRoute({
      component: () => import("../page/baseInfoDetails"),
    })
  },
  // 答题进度页
  {
    path: "/answerSchedule",
    name: "answerSchedule",
    showHeader: false,
    component: dynamicRoute({
      component: () => import("../page/answerSchedule"),
    }),
  },
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
