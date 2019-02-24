import React, { Component } from 'react'
import { Card, Icon, Row, Col, Button } from 'antd'
import { Table } from 'antd'
import UserProfile from '../../components/UserProfile'
import StockInformation from '../../components/StockInformation'

const ButtonGroup = Button.Group

export default class Home extends Component {
  render () {
    return (
      <div>
        <div className='user-profile'>
          <UserProfile />
        </div>
        <div className='main-content'>
          <StockInformation />
        </div>
      </div>
    )
  }
}
