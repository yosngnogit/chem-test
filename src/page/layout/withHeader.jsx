import React from 'react'
import { Switch, Route } from 'react-router-dom';

import Header from '@/components/header/index';

export default function withHeader() {
  return (
    <div>
      <Header />
      <Switch>
        
      </Switch>
    </div>
  )
}
