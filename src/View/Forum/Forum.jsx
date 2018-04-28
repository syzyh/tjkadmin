import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Button, Menu, Icon, Spin, message } from 'antd';

import _ from 'lodash';

import { fetchAllDiscussions, deleteDiscussion, deleteOpinion } from './action.js';
import { fetchingData } from '../Mobile/action.js';
const { Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;


class Forum extends Component {
  componentDidMount() {
    if (this.props.forum.discussions.length === 0)
      this.props.fetchAllDiscussions();
    if (this.props.mobile.categorys.length === 0)
      this.props.fetchingData();
  }

  state = {
    selectedDepartment: '',
    selectedName: '',
  }

  onSelectAudio = ({item, key, selectedKeys}) => {
    const department = _.find(this.props.mobile.departments, d => d._id === key);
    const selectedName = department ? department.department_urlName : '';
    this.setState({selectedDepartment: key, selectedName});
  }
  
  render() {
    console.log(this.props.forum.discussions);
    return (
      <Spin spinning={this.props.mobile.fetching || this.props.mobile.updating || this.props.forum.fetching || this.props.forum.updating} delay={800}>
      <Layout style={{backgroundColor: '#fff', margin: '1rem 0'}}>
        <Content style={{borderRight: 'solid 1px #e9e9e9'}}>
          <div style={{marginRight: '1rem'}}>
            {this.props.forum.discussions.filter(d => d.branch_name === this.state.selectedName).map(d => (
              <div style={{border: 'solid 1px #cccccc', margin: '20px 0', padding: '20px'}}>
                <div style={{display: 'inline-block', margin: ' -20px 20px 0 0'}}><img src={d.user.avatarUrl} style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover'}} /></div>
                <div style={{display: 'inline-block', width: '80%'}}>
                  <div>用户名：{d.user.userName}</div>
                  <div>标题：{d.title}</div>
                  <div style={{wordBreak: 'break-word'}}>内容：{d.content[0]}</div>
                </div>
                <div style={{display: 'inline-block'}}><a>删除</a></div>
              </div>
            ))}
          </div>
        </Content>
        <Sider width={200} style={{minHeight: 280, backgroundColor: '#fff'}}>
          <Menu mode="inline" defaultSelectedKeys={['0']} style={{borderRightWidth: '0', textAlign: 'center'}} onSelect={this.onSelectAudio}>
            {this.props.mobile.categorys.map(c => (
                <SubMenu
                  key={c._id}
                  title={<span>{c.category_name}</span>}
                >
                  {this.props.mobile.departments.map(d => {
                    if (d.category_id === c._id) {
                      return (<Menu.Item key={d._id}>{d.department_name}</Menu.Item>)
                    } else {
                      return ;
                    }
                  })
                  }
                </SubMenu>
              ))}
          </Menu>
        </Sider>
      </Layout>
      </Spin>
    );
  }
}

export default connect(
  state => ({forum: state.forum, mobile: state.mobile}),
  dispatch => ({
    fetchAllDiscussions: () => { dispatch(fetchAllDiscussions()); },
    deleteDiscussion: (d) => { dispatch(deleteDiscussion(d)); },
    fetchingData: () => { dispatch(fetchingData()); },
  })
)(Forum);