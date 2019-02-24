import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import Layout from './containers/Layout'
import userActions from './actions/userActions'

store.dispatch(userActions.getCurrentUser())

class App extends React.Component {
  render () {
    return (
      <Provider store={store} >
        <Layout />
      </Provider>
    )
  }
}

render(
  <App />,
  document.getElementById('root')
)
