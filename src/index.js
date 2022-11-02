import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';


import './assets/css/normalize.css'
import './assets/css/common.css'
import routes from './route';

import Header from '@/components/header/index';

const renderTreeRoutes = (route) => {
  return route.children ?
    <Route key={route.path} path={route.path} component={(props) => 
      (
        <div>
          { route.showHeader !== false && <Header/>}
          <route.component {...props} />
        </div>
      )
    }>
      {route.children.map((item) => renderTreeRoutes(item))}
    </Route>
    :
    <Route exact key={route.path} path={route.path} component={(props) =>(
        <div>
          { route.showHeader !== false && <Header/>}
          <route.component {...props} />
        </div>
    )} />
}

createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={zh_CN}>
  <Router>
    <Switch>
      {routes.map((item) => renderTreeRoutes(item))}
    </Switch>
  </Router>
  </ConfigProvider>
)