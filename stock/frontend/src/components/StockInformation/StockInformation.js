import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, message, Row, Col, Card, Avatar, Statistic, Icon, Table } from 'antd'
import { loadLatestQuote, loadQuoteHistory, loadSymbolLogo } from '../../actions/stockAPI'
import BuySellModal from '../BuySellModal'

const { Meta } = Card
const Search = Input.Search

const columns = [{
  title: 'Date',
  dataIndex: 'date',
}, {
  title: 'Open($)',
  dataIndex: 'open',
},{
  title: 'Close($)',
  dataIndex: 'close',
}];

class StockInformation extends Component {
  state = {
    symbol: 'NFLX',
    quote: null,
    quoteHistory: [],
    loaded: false,
  }

  componentDidMount() {
    this.loadQuote(this.state.symbol)
  }

  loadQuote = (symbol) => {
    console.log(symbol)
    Promise.all([
      loadLatestQuote(symbol),
      loadSymbolLogo(symbol),
      loadQuoteHistory(symbol, '3m')
    ])
    .then(values => {
      this.setState(prevState => {
        const [quote, logo, history] = values
        const quoteWithLogo = { ...quote, logo: logo }
        return {
          symbol: quote.symbol,
          quote: quoteWithLogo,
          quoteHistory: history,
          loaded: true,
        }        
      })
    })
    .catch(err => {
      if (err.response.status === 404){
        message.error(`The stock symbol ${symbol} does not exist`)
      }
    })
  }

  handleSearch = (value) => {
    this.setState(prevState => {
      return {
        symbol: value
      }
    })
    this.loadQuote(value)
  }



  render () {
    const { quote, loaded, quoteHistory} = this.state
    return (
      loaded ? (
        <div>
          <div className='jumbotron jumbotron-fluid bg-dark text-light'>
            <h1 style={{color: 'white', textAlign: 'center'}}> Search A Symbol</h1>
            <Search
              style = {{marginLeft: '12.5%', width: '75%'}}
              placeholder='input symbol'
              defaultValue={this.state.symbol}
              enterButton='Search'
              size='large'
              onSearch={(value) => this.handleSearch(value)}
            />
          </div>
          <Row>
            <Col xs={12}>
              <Card
                  style={{ width: '100%' }}
                  actions={[
                    <BuySellModal type='Buy' quote={quote}/>,
                    <BuySellModal type='Sell' quote={quote}/>
                  ]}
                >
                  <Meta
                    avatar={<Avatar src={quote.logo} />}
                    title={quote.companyName}
                    description={'Latest Update: ' +quote.latestTime}
                  />
                  <br />
                  <Statistic precision={2} title="Close Price(AUD($))" value={quote.close} />
                  <Statistic precision={2} title="Latest Price(AUD($))" value={quote.latestPrice} />
                  <Statistic precision={2} title="Week 52 High(AUD($))" valueStyle={{ color: '#3f8600' }} prefix={<Icon type="arrow-up" />} value={quote.week52High} />
                  <Statistic precision={2} title="Week 52 Low(AUD($))" valueStyle={{ color: '#cf1322' }} prefix={<Icon type="arrow-down" />} value={quote.week52Low} />
                  <Statistic precision={2} title="Exchange" value={quote.primaryExchange} />
                </Card>
            </Col>
            <Col xs={12}>
              <Table rowKey={(record, i ) => i } columns={columns} dataSource={quoteHistory.sort((a, b) => (a.date < b.date) ? 1 : -1)} size="middle" />
            </Col>
          </Row>
        </div>
      ) : null
    )
  }
}

export default StockInformation
