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
  // 答题进度页
  {
    path: "/answerSchedule",
    name: "answerSchedule",
    component: dynamicRoute({
      component: () => import("../page/answerSchedule"),
    }),
  },
  
];
export default routes;
