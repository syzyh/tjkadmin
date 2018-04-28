import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Spin, message } from 'antd';
import { Link, Route, Switch } from 'react-router-dom';

import { getAllData } from './action';

import Picture from './View/Picture';
import Video from './View/Video';
import Audio from './View/Audio';


class Material extends Component {
  componentDidMount() {
    this.props.getAllData();
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { error } = this.props;
    if (error) message.error(error);
  }
  
  render() {
    const { fetchingMaterial, error } = this.props;
    
    if(error === '网络加载素材出错') return <div>无法连接到后台网络</div>
    return (
      <div>
        <Spin spinning={fetchingMaterial} delay={500}>
          <Menu
            defaultSelectedKeys={[this.props.location.pathname.split('/')[2] || 'picture']}
            mode="horizontal"
          >
            <Menu.Item key="picture">
              <Link to={`${this.props.match.url}/picture`}>
                <Icon type="mail" />图片库
              </Link>
            </Menu.Item>
            <Menu.Item key="audio">
              <Link to={`${this.props.match.url}/audio`}>
                <Icon type="appstore" />音频库
              </Link>
            </Menu.Item>
            <Menu.Item key="video">
              <Link to={`${this.props.match.url}/video`}>
              视频库
              </Link>
            </Menu.Item>
          </Menu>
          <Switch>
            <Route exact path={`${this.props.match.url}`} component={fetchingMaterial ? ()=>(<div></div>) : Picture}></Route> 
            <Route path={`${this.props.match.url}/picture`} component={fetchingMaterial ? ()=>(<div></div>) : Picture}></Route>
          </Switch>
          <Route path={`${this.props.match.url}/audio`} component={fetchingMaterial ? ()=>(<div></div>) : Audio}></Route>
          <Route path={`${this.props.match.url}/video`} component={fetchingMaterial ? ()=>(<div></div>) : Video}></Route>
        </Spin>
      </div>
    );
  }
}

export default connect(
  state => ({
    fetchingMaterial: state.material.fetchingMaterial,
    error: state.material.error,
  }),
  dispatch => ({
    getAllData: () => {dispatch(getAllData());},
  })
)(Material);