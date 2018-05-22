import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Layout, Button } from 'antd';

import _ from 'lodash';

import {
  createAudio,
  deleteAudio,
  updateAudio,
  topAudio,
} from './action.js';

import MediaTable from './MediaTable';

const { Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

class Audio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDepartment: '',
      creating: false,
      type: props.match.url.split('/').pop(),
    };
  }

  onSelectAudio = ({item, key, selectedKeys}) => {
    this.setState({selectedDepartment: key});
  }

  render() {
    const filterData = _.filter(this.props.audios, a => a.department_id === this.state.selectedDepartment && a.type === this.state.type);
    const selectedName = this.state.selectedDepartment ? _.find(this.props.departments, d => d._id === this.state.selectedDepartment).department_name : '尚未选择分类';
    return (
      <Layout style={{backgroundColor: '#fff', margin: '1rem 0'}}>
        <Content style={{borderRight: 'solid 1px #e9e9e9'}}>
          <div style={{marginBottom: '1rem', height: '28px'}}>
            <span style={{fontSize: '1rem', marginRight: '1rem', display: 'inline-block', maxWidth: '10rem',textOverflow: 'ellipsis', overflow: 'hidden', float: 'left'}}>{selectedName}</span>
            <div style={{display: 'inline-block', float: 'right', marginRight: '1rem'}}>
                <Button disabled={this.state.creating || !this.state.selectedDepartment} type="primary" icon="file-add" onClick={() => {this.setState({creating: true})}}>新建推送</Button>
            </div>
          </div>
          <div style={{marginRight: '1rem'}}>
            <MediaTable type={this.state.type} data={filterData} departmentId={this.state.selectedDepartment} creating={this.state.creating} created={()=>this.setState({creating: false})} createAudio={this.props.createAudio} deleteAudio={this.props.deleteAudio}  updateAudio={this.props.updateAudio} topAudio={this.props.topAudio} />
          </div>
        </Content>
        <Sider width={200} style={{minHeight: 280, backgroundColor: '#fff'}}>
          <Menu mode="inline" defaultSelectedKeys={['0']} style={{borderRightWidth: '0', textAlign: 'center'}} onSelect={this.onSelectAudio}>
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
          </Menu>
        </Sider>
      </Layout>
    );
  }
}

export default connect(
  state => {
    return { ...state.mobile };
  },
  dispatch => ({
    createAudio: (id, name, url, imgUrl, description, type) => {dispatch(createAudio(id, name, url, imgUrl, description, type))},
    deleteAudio: id => {dispatch(deleteAudio(id))},
    updateAudio: (id, name, url, imgUrl, description) => {dispatch(updateAudio(id, name, url, imgUrl, description))},
    topAudio: id => {dispatch(topAudio(id))},
  })
)(Audio);