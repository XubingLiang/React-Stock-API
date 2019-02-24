import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/stock_api/'
})
api.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
api.defaults.xsrfCookieName = 'csrftoken'
api.defaults.withCredentials = true
api.defaults.headers.post['Content-Type'] = 'application/json'
console.log('dfsdsf')
console.log(api.defaults)
export default function api_call (type, method, params = {}) {
  console.log(method)
  switch (method) {
    case 'GET':
      return api.get(type)
    case 'POST':
      return api.post(type, params)
    case 'PUT':
      return api.put(type, params)
    case 'DELETE':
      return api.delete(type)
    default:
      return null
  }
}

export { api_call }
