import reducers from './reducers'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'

const middlewares = [promise(), thunk, process.env.NODE_ENV !== 'production' && createLogger()].filter(Boolean)
const middleware = applyMiddleware(...middlewares)

const store = createStore(reducers, middleware)

export default store
