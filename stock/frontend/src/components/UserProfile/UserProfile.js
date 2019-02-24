import React, { Component } from 'react'
import { Card, Icon, Row, Col, Button, Modal, Form, Input, Statistic } from 'antd'
import { Table } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { logout } from '../../actions/userActions.js'
import { getUserSumarry } from '../../actions/userActions.js'
import TopupWithdrawForm from '../../components/TopupWithdrawForm'
import { Redirect } from 'react-router-dom'
const ButtonGroup = Button.Group

const columns = [{
  title: 'Symbol',
  dataIndex: 'symbol',
}, {
  title: 'Net($)',
  dataIndex: 'net',
}, {
  title: 'Hold',
  dataIndex: 'hold',
}]
const data = [{
  key: '1',
  symbol: 'MICR',
  price: 100,
  hold: 12
}]

class UserProfile extends Component {
  state = {
    userRecordSummary: null
  }
  static propTypes = {
    logout: PropTypes.func.isRequired,
    getUserSumarry: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.getUsersRecords()
  }

  getUsersRecords = () => {
    const { username } = this.props.user 
    this.props.getUserSumarry(username)
    .then(value =>{
      this.setState(prevState => {
        return {
          userRecordSummary: value
        }        
      })
      console.log(this.state)
    })
    .catch(err => {
      message.error(`Error when getting ${username} records`)
    })
    
  }

  render () {
    const { balance } = this.props.user.profile
    const { username } = this.props.user
    const { userRecordSummary } = this.state
    const totalAsset = userRecordSummary ? userRecordSummary.total_asset  : 0
    const recordSummary = userRecordSummary ? userRecordSummary.symbols_summary : data
    const title = `Hi ${username}`

    return (
      <div>
        <div>
          <Card title={title} bordered style={{ width: '100%' }} actions={[<Icon onClick={() => this.props.logout()} type='logout' />]}>
            <Row gutter={24}>
              <Col className='gutter-row' span={24}>
                <div className='gutter-box'><Statistic title="Account Balance (AUD($))" value={balance} precision={2} /></div>
              </Col>
            </Row>
            <br />
            <Row gutter={24}>
              <ButtonGroup>
                <Col className='gutter-row' span={12}>
                    <TopupWithdrawForm 
                      type='Topup'
                      class='primary'
                      username={username}
                    />
                </Col>
                <Col className='gutter-row' span={12}>
                    <TopupWithdrawForm 
                      type='Withdraw'
                      class=''
                      username={username}
                    />                  
                </Col>
              </ButtonGroup>
            </Row>          
            <br />
            <Row gutter={24}>
              <Col className='gutter-row' span={24}>
                <div className='gutter-box'><Statistic title="Net Total Asset (AUD($))" value={totalAsset} precision={2} /></div>
              </Col>
            </Row>
          </Card>
        </div>
        <div>
          <Table title={() => 'Record Summary'} columns={columns} dataSource={recordSummary} size='middle' />
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  error: state.userReducer.error,
  user: state.userReducer.information
})

export default connect(
  mapStateToProps,
  { logout, getUserSumarry}
)(UserProfile)
