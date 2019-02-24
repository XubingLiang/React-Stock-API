import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import Home from '../Home'

export default class PrivateLayout extends React.Component {
  render () {
    return (
      <div>
        <div className='content'>
          <Switch>
            <Route exact path='/' component={Home} />
          </Switch>
        </div>
      </div>
    )
  }
}
