import React, { Component } from 'react'
import { Card, Icon, Row, Col, Button, Modal, Form, Input,InputNumber } from 'antd'
import { manageBalance } from '../../actions/userActions.js'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

class TopupWithdrawForm extends React.Component {
  state = { 
    visible: false,
    value: 0
  }

  static propTypes = {
    manageBalance: PropTypes.func.isRequired,
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    let username = this.props.username
    let value = this.state.value
    let type = this.props.type
    console.log(e);
    this.setState({
      visible: false,
    });
    this.props.manageBalance(username, value, type)
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

 onChange = (value) => {
    this.setState({
      value: value,
    })
  }

  render() {
    return (
      <div  className='gutter-box'>
        <Button type={this.props.class} onClick={this.showModal}>
          {this.props.type}
        </Button>
        <Modal
          title={this.props.type}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
         Amount:  <InputNumber min={1} max={1000000} defaultValue={0} onChange={this.onChange}/>
        </Modal>
      </div>
    );
  }
}  

const mapStateToProps = (state) => ({
  error: state.userReducer.error
})


export default connect(
  mapStateToProps,
  { manageBalance }
)(TopupWithdrawForm)