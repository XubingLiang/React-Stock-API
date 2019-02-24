import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import LoginForm from '../../components/LoginForm'
import SignupForm from '../../components/SignupForm'

class PublicLayout extends React.Component {
  render () {
    const type = this.props.match.params.type
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    if (this.props.isAuthenticated) {
      return <Redirect to={from} />
    }

    return (
      <div className='content'>
        { type === 'login'
          ? <LoginForm />
          : <SignupForm />
        }
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.userReducer.isAuthenticated
})

export default connect(mapStateToProps)(PublicLayout)
