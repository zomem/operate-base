import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Start from './pages/start/start'
import Home from './pages/home/home'
import './App.css'

function App() {
  return (
    <Switch>
      <Route path={'/'} exact component={Start} />
      <Route path={'/home'} component={Home} />
    </Switch>
  )
}

export default App
