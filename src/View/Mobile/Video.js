import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Layout, Spin, message, Input, Button } from 'antd';

import _ from 'lodash';

import {
  fetchingData,
  createCategory,
  deleteCategory,
  updateCategory,
  topCategory,

  createDepartment,
  deleteDepartment,
  updateDapartment,
  topDepartment,
} from './action.js';

import PopoverModel from '../../Component/Popover';

const { Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDepartment: {
        _id: '',
        department_name: '',
      },
      defaultCategory: [
        {
          _id: '0',
          category_name: '无分类',
        },
      ],
      popoverValue: '',
      creatingDepartment: false,
    };
  }

  onSelectDepartment = ({key}) => {
    const selectedDepartment = _.find(this.props.departments, g => (g._id === key));
    this.setState({selectedDepartment});
  }

  render() {
    return (
      <Spin spinning={this.props.fetching || this.props.updating} delay={800}>
      <Layout style={{backgroundColor: '#fff', margin: '1rem 0'}}>
        <Content style={{borderRight: 'solid 1px #e9e9e9'}}>
          {/* <div style={{marginBottom: '1rem', height: '28px'}}>
            <span style={{fontSize: '1rem', marginRight: '1rem', display: 'inline-block', maxWidth: '10rem',textOverflow: 'ellipsis', overflow: 'hidden', float: 'left'  }}>{selectedCategory.category_name}</span>
            {(selectedCategory.category_name === '轮播') ||
            <span style={{display: 'inline-block'}}>
              <PopoverModel
                title="编辑名称"
                confirm={() => {
                  this.props.updateCategory(selectedCategory._id, this.state.popoverValue);
                  this.setState({popoverValue: ''});
                }}
                content={(<Input placeholder="分类名称" value={this.state.popoverValue} onChange={e => this.setState({popoverValue: e.target.value})}/>)}
              >
                <Button icon="edit">重命名</Button>
              </PopoverModel>
              <span style={{marginLeft:'1rem'}}></span>
              <PopoverModel
                title="删除分类"
                confirm={() => {
                  this.props.deleteCategory(selectedCategory._id);
                  this.setState({selectedCategory: this.state.defaultCategory[0]});
                }}
                content={(<div>仅删除分类，内部的病种进入未命名中</div>)}
              >
                <Button icon="delete">删除分类</Button>
              </PopoverModel>
              <span style={{marginLeft:'1rem'}}></span>
              <PopoverModel
                title="置顶"
                confirm={() => {
                  this.props.topCategory(selectedCategory._id);
                }}
                content={(<div>将该分类至于泳道的顶部</div>)}
              >
                <Button icon="to-top">置顶分类</Button>
              </PopoverModel>
            </span>
            }
            <div style={{display: 'inline-block', float: 'right', marginRight: '1rem'}}>
                <Button disabled={this.state.creatingDepartment} type="primary" icon="file-add" onClick={() => {this.setState({creatingDepartment: true})}}>新建病情</Button>
            </div>
          </div>
          <div style={{marginRight: '1rem'}}>
            <DepartmentTable categoryId={this.state.selectedCategory._id} data={selectedDepartments} delete={this.props.deleteDepartment} update={this.props.updateDapartment} top={this.props.topDepartment} create={this.props.createDepartment} creating={this.state.creatingDepartment} createdCallback={()=>{this.setState({creatingDepartment: false});}}/>
          </div> */}
        </Content>
        <Sider width={200} style={{minHeight: 280, backgroundColor: '#fff'}}>
          <Menu mode="inline" defaultSelectedKeys={['0']} selectedKeys={[this.state.selectedDepartment._id]} style={{borderRightWidth: '0', textAlign: 'center'}} onSelect={this.onSelectDepartment}>
            {this.props.categorys.map(c => (
                <SubMenu
                  key={c._id}
                  title={<span>{c.category_name}</span>}
                >
                  {this.props.departments.map(d => {
                    if (d.category_id === c._id) {
                      return (<Menu.Item key={d._id}>{d.department_name}</Menu.Item>)
                    } else {
                      return null;
                    }
                  })
                  }
                </SubMenu>
              ))}
            <PopoverModel 
                title="新建分类"
                confirm={()=>{
                  if (this.state.popoverValue) {
                    this.props.createCategory(this.state.popoverValue);
                    this.setState({popoverValue: ''});
                  } else {
                    message.error('分类名称不能为空')
                  }
                }}
                content={(<Input placeholder="分类名称" value={this.state.popoverValue}  onChange={(e) => this.setState({popoverValue: e.target.value})} /> )}
              >
              <Button type="primary" icon="folder-add">新建</Button>
            </PopoverModel>
          </Menu>
        </Sider>
      </Layout>
      </Spin>
    );
  }
}

export default connect(
  state => {
    return { ...state.mobile };
  },
  dispatch => ({
    fetchingData: () => { dispatch(fetchingData()); },
    createCategory: name => {dispatch(createCategory(name))},
    deleteCategory: id => {dispatch(deleteCategory(id))},
    updateCategory: (id, name) => {dispatch(updateCategory(id, name))},
    topCategory: id => {dispatch(topCategory(id))},

    createDepartment: (id, name, imgUrl, urlName) => {dispatch(createDepartment(id, name, imgUrl, urlName))},
    deleteDepartment: id => {dispatch(deleteDepartment(id))},
    updateDapartment: (id, name, imgUrl, urlName) => {dispatch(updateDapartment(id, name, imgUrl, urlName))},
    topDepartment: id => {dispatch(topDepartment(id))},
  })
)(Video);