import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import { Menu, Icon, Spin } from 'antd';

import Swim from './Swim';
import Audio from './Audio';

import {
  fetchingData,
} from './action.js';

class Mobile extends Component {

  componentDidMount() {
    this.props.fetchingData();
  }

  render() {
    return (
      <div>
        <Spin spinning={this.props.fetching || this.props.updating} delay={800}>
          <Menu
            defaultSelectedKeys={[this.props.location.pathname.split('/')[2] || 'swim']}
            mode="horizontal"
          >
            <Menu.Item key="swim">
              <Link to={`${this.props.match.url}/swim`}>
                <Icon type="appstore" />泳道管理
              </Link>
            </Menu.Item>
            <Menu.Item key="audio">
              <Link to={`${this.props.match.url}/audio`}>
                <Icon type="mail" />音频管理
              </Link>
            </Menu.Item>
            <Menu.Item key="video">
              <Link to={`${this.props.match.url}/video`}>
                <Icon type="video" />视频管理
              </Link>
            </Menu.Item>
          </Menu>
          <Switch>
            <Route exact path={`${this.props.match.url}`} component={Swim}></Route> 
            <Route path={`${this.props.match.url}/swim`} component={Swim}></Route>
          </Switch>
          <Route path={`${this.props.match.url}/audio`} component={Audio}></Route>
          <Route path={`${this.props.match.url}/video`} component={Audio}></Route>
        </Spin>
      </div>
    );
  }
}

export default connect(
  state => {
    return { ...state.mobile };
  },
  dispatch => ({
    fetchingData: () => { dispatch(fetchingData()); },
  })
)(Mobile);