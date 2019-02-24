import React, { Component } from 'react'
import { Card, Icon, Row, Col, Button, Modal, Form, Input,InputNumber, Statistic, message } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { manageStock } from '../../actions/userActions.js'

class BuySellModal extends Component {
  state = { 
    visible: false,
    amount: 0
  }

  static propTypes = {
    manageStock: PropTypes.func.isRequired
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    const { amount } = this.state
    const { username } = this.props.user
    const { type } = this.props
    const { symbol, latestPrice } = this.props.quote
    if (!Number.isInteger(amount) || amount <= 0 ) {
      message.error('Amount is not valid, Please try again')
      return 
    }
    this.setState({
      visible: false,
    });
    this.props.manageStock(username,latestPrice, amount, type.toUpperCase(), symbol)
    window.location.reload();
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

 onChange = (value) => {
    this.setState({
      amount: value,
    })
  }

  render() {
    const {quote, type} = this.props
    return (
      <div>
        <Button onClick={this.showModal}>
         {this.props.type}
        </Button>
        <Modal
          title={this.props.type}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Statistic precision={2} title="Latest Price(AUD($))" value={quote.latestPrice} />
          {`${type} Amount: `}<InputNumber min={1} max={10000} defaultValue={0} onChange={this.onChange}/>
        </Modal>
      </div>
    );
  }
}  

const mapStateToProps = (state) => ({
  error: state.userReducer.error,
  user: state.userReducer.information
})

export default connect(
  mapStateToProps,
  { manageStock }
)(BuySellModal)

