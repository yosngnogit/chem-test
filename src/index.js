import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './assets/css/normalize.css'
import './assets/css/common.css'
import routes from './route';

const renderTreeRoutes = (route) => {
  return route.children ?
    <Route exact key={route.path} path={route.path} component={(props) => <route.component {...props} />}>
      {route.children.map((item) => renderTreeRoutes(item))}
    </Route>
    :
    <Route exact key={route.path} path={route.path} component={(props) => <route.component {...props} />} />
}

createRoot(document.getElementById('root')).render(
  <Router>
    <Switch>
      {routes.map((item) => renderTreeRoutes(item))}
    </Switch>
  </Router>
)