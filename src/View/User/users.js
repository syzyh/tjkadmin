import React, { Component } from 'react';
import { Table, Input, Select, Spin } from 'antd';
import { fetchUsersByNameAPI,changeUserRole } from './api';

class User extends Component {

  constructor(props, context) {
    super(props, context);
    this.columns = [{
      title: '姓名',
      dataIndex: 'userName',
      key: 'name',
    }, {
      title: '头像',
      dataIndex: 'avatarUrl',
      key: 'avatar',
      render: (url) => (<img style={{display: 'block', margin: '-12px 0px', objectFit: 'cover', borderRadius: '6px'}} width="64px" height="64px" alt="test" src={url} />),
    }, {
      title: '创建时间',
      dataIndex: 'created_time',
      key:'created_time',
    }, {
      title: '登录时间',
      dataIndex: 'lastSkim_time',
      key:'lastSkim_time',
    }, {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (text, record, index) => (
        <Select defaultValue={text} style={{ width: 100 }} onChange={
          value => {
            this.setState({fetching: true});
            changeUserRole(record._id, value).then(
              result => {
                console.log("change role result:", result);
                if (result.data.success) {
                  this.setState({fetching: false})
                }
              }
            );
          }
        }>
          <Select.Option value="user">用户</Select.Option>
          <Select.Option value="admin">管理员</Select.Option>
          <Select.Option value="baned">禁用者</Select.Option>
        </Select>
      )
    }];

    this.state = {
      fetching: false,
      users: []
    }
  }
  
  render() {
    return (
      <Spin spinning={this.state.fetching}>
        <div style={{marginBottom: '10px', float: 'right'}}>
          <div style={{display: 'inline-block', paddingRight: '10px'}}>用户名称: </div>
          <Input.Search
            placeholder="输入用户名称"
            enterButton
            style={{width: '240px'}}
            onSearch={
              value => {
                this.setState({fetching: true});
                fetchUsersByNameAPI(value).then(result=> {
                  console.log("fetch users:", result);
                  this.setState({fetching: false, users: result.data});
                });
              }
            } 
          />
        </div>
        <Table dataSource={this.state.users} columns={this.columns} rowKey="_id" />
      </Spin>
    );
  }
}

export default User;
