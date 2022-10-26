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
  
];
export default routes;
