import * as actionTypes from '../../actionTypes'

const initialState = {
  isAuthenticated: false,
  error: '',
  information: {},
  loading: false
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTHENTICATED :
      return {
        ...state,
        isAuthenticated: true,
        information: action.payload,
        loading: false
      }
    case actionTypes.LOGIN_FAILED :
      return {
        ...state,
        error: action.payload,
        isAuthenticated: false,
        loading: false
      }
    case actionTypes.GET_CURRENT_USER:
      return {
        ...state,
        information: action.payload,
        isAuthenticated: true,
        loading: false
      }
    case actionTypes.NOT_LOGIN:
      return {
        ...state,
        isAuthenticated: false,
        loading: false
      }
    case actionTypes.IS_LOADING:
      return {
        ...state,
        loading: true
      }
    case actionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        loading: false
      }
    default:
      return state
  }
}

export default userReducer
