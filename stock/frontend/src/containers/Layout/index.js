import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import React from 'react'
import { connect } from 'react-redux'
import PublicLayout from './PublicLayout'
import PrivateLayout from './PrivateLayout'
import PrivateRoute from '../../components/PrivateRoute'
import Header from '../../components/Header'

class Layout extends React.Component {
  render () {
    console.log(this.props.isAuthenticated)
    return (
      <Router>
        <div>
          <Header isAuthenticated={this.props.isAuthenticated} />
          { this.props.loading ? null
            : (<Switch>
              <Route path='/auth/:type' component={PublicLayout} />
              <PrivateRoute path='/' component={PrivateLayout} isAuthenticated={this.props.isAuthenticated} />
            </Switch>)
          }

        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated,
  loading: state.userReducer.loading
})

export default connect(
  mapStateToProps
)(Layout)
