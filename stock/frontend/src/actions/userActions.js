import * as actionTypes from '../actionTypes'
import api_call from './api'
import { message } from 'antd'

export const login = (user) => async dispatch => {
  api_call('auth/login/', 'POST', user).then((response) => {
    message.success('Login successfully')
    dispatch({
      type: actionTypes.AUTHENTICATED,
      payload: response.data.user
    })
  }).catch((error) => {
    message.error('Incorrect username or password, please try again')
    dispatch({
      type: actionTypes.LOGIN_FAILED,
      payload: 'login error'
    })
  })
}

export const signup = (user) => async dispatch => {
  api_call('auth/signup/', 'POST', user).then((response) => {
    message.success('Signup successfully')
    dispatch({
      type: actionTypes.AUTHENTICATED,
      payload: response.data.user
    })
  }).catch((error) => {
    message.error('Signup is not successful, please try again')
    dispatch({
      type: actionTypes.LOGIN_FAILED,
      payload: 'login error'
    })
  })
}

export const logout = () => async dispatch => {
  dispatch({
    type: actionTypes.IS_LOADING,
    payload: true
  })
  try {
    let response = await api_call('auth/logout/', 'POST')
    dispatch({
      type: actionTypes.LOGOUT,
      payload: false
    })
  } catch (e) {
    console.log(e)
  }
}

export const manageBalance = (username, value, type) => async dispatch => {
  let params = {
    value: value,
    type: type
  }
  try {
    let response = await api_call(`users/${username}/balance`, 'POST', params)
    dispatch({
      type: actionTypes.GET_CURRENT_USER,
      payload: response.data
    })
  } catch (e) {
    console.log(e)
  }
}

export const manageStock = (username, price, amount, type, symbol) => async dispatch => {
  let params = {
    price: price,
    amount: amount,
    type: type,
    symbol: symbol
  }
  try {
    let response = await api_call(`users/${username}/record`, 'POST', params)
    message.success(`${type} stock successfully`)
    dispatch({
      type: actionTypes.GET_CURRENT_USER,
      payload: response.data
    })
  } catch (e) {
    message.error(`${type} stock is not successfully, try again later`)
    console.log(e)
  }
}

export const getCurrentUser = () => async dispatch => {
  dispatch({
    type: actionTypes.IS_LOADING,
    payload: true
  })
  try {
    let response = await api_call('auth/get_current_user/', 'GET')
    dispatch({
      type: actionTypes.GET_CURRENT_USER,
      payload: response.data
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: actionTypes.NOT_LOGIN,
      payload: false
    })
  }
}

export const getUserSumarry = (username) => async dispatch => {
  return api_call(`users/${username}/record/summary`, 'GET')
    .then(res => res.data)
}

export default {
  login,
  getCurrentUser,
  logout,
  signup,
  manageBalance,
  manageStock,
  getUserSumarry
}
