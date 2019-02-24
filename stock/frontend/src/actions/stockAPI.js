import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.iextrading.com/1.0'
})

export const loadLatestQuote = (symbol) => {
  return api.get(`stock/${symbol}/quote`)
    .then(res => res.data)
}

export const loadQuoteHistory = (symbol, period) => {
  return api.get(`stock/${symbol}/chart/${period}`)
    .then(res => res.data)
}

export const loadSymbolLogo = (symbol) => {
  return api.get(`stock/${symbol}/logo`)
    .then(res => res.data.url)
}
