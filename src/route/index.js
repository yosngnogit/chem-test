import dynamicRoute from "./dynamicRoute";

const routes = [
  {
    path: "/",
    component: dynamicRoute({
      component: () => import("../page/index"),
    }),
  },
  {
    path: "/login",
    name: "login",
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
    }),
  },
  
];
export default routes;
