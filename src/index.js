import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import './assets/css/normalize.css'
import 'antd/dist/antd.min.css';

import routes from './route';
import zh_CN from 'antd/es/locale/zh_CN';

import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();

const renderTreeRoutes = (route) => {
  return route.children ?
    <Route key={route.path} path={route.path} component={(props) => <route.component {...props} />}>
      {route.children.map((item) => renderTreeRoutes(item))}
    </Route>
    :
    <Route key={route.path} path={route.path} component={(props) => <route.component {...props} />} />
}

createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={zh_CN}>
    <Router history={history}>
      <Switch>
        {routes.map((item) => renderTreeRoutes(item))}
      </Switch>
    </Router>
  </ConfigProvider>
)