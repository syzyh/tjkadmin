import React, { Component } from 'react';

import { Route, Link } from 'react-router-dom';
import { Layout, Menu, Icon, Input, Button,message, Spin } from 'antd';

import Material from './View/Material/Material';
import Mobile from './View/Mobile/Mobile';
// import Forum from './View/Forum/Forum';
import User from './View/User/users';

import './App.css';

const { Header, Content, Footer, Sider } = Layout;


class App extends Component {
  state = {
    collapsed: false,
    mode: 'inline',
    password: '',
    username: '',
    login: false,
    loadingTime: 1000,
    loading: false,
  };

  render() {
    if (!this.state.login) {
      return (
        <Spin spinning={this.state.loading}>
        <div style={{width: '300px', margin: 'auto', marginTop: '100px'}}>
           <Input value={this.state.username} onChange={e=>this.setState({username: e.target.value})} style={{marginBottom: '30px'}} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
           <Input value={this.state.password} onChange={e=>this.setState({password: e.target.value})} style={{marginBottom: '30px'}} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
           <Button style={{width: '100%'}} type="primary" onClick={()=>{
              if(this.state.password === 'anyangRBC' && this.state.username === 'tingjian') {
                this.setState({login: true, loading: false});
              } else {
                this.setState({loading: true});
                message.error('用户名或密码错误');
                setTimeout(()=>{
                  this.setState({loadingTime: this.state.loadingTime * 2, loading: false});
                }, this.state.loadingTime);
              }
           }}>登录</Button>
        </div>
        </Spin>
      )
    } else {
      return (
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ lineHeight: '64px' }}
            >
            </Menu>
          </Header>
          <Content style={{margin: '50px auto 0 auto' }}>
            <Layout style={{ padding: '24px 0', background: '#fff' ,width: '1200px'}}>
              <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={[this.props.location.pathname.split('/')[1]]}
                  defaultOpenKeys={['sub1','sub2']}
                  style={{ height: '100%' }}
                  onClick={({key, keyPath}) => {
                    console.log(key, keyPath);
                  }}
                >
                  <Menu.Item key="/">
                    <Link to="/">
                      <Icon className="sider-icon" type="home"/>
                      <span>主页</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="material"><Link to="/material"><Icon className="sider-icon" type="picture"/>素材管理</Link></Menu.Item>
                  <Menu.Item key="mobile"><Link to="/mobile"><Icon className="sider-icon" type="mobile"/>界面管理</Link></Menu.Item>
                  <Menu.Item key="forum"><Link to="/forum"><Icon className="sider-icon" type="team"/>论坛管理</Link></Menu.Item>
                  <Menu.Item key="user"><Link to="/user"><Icon className="sider-icon" type="user"/>用户管理</Link></Menu.Item>
                  <Menu.Item key="message">
                    <Link to="/message">
                      <Icon className="sider-icon" type="message"/>
                      <span>消息管理</span>
                    </Link>
                  </Menu.Item>
                </Menu>
              </Sider>
              
              <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <Route path="/material" component={Material}/>
                <Route path="/mobile" component={Mobile}/>
                <Route path="/user" component={User}/>
              </Content>
            </Layout>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            听健康 ©2017 北京某某科技有限公司
          </Footer>
        </Layout>
      );
    }
  }
}

export default App;
