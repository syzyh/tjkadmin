import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Input, message, Upload, Button, Spin } from 'antd';

import {
  confirmCreateGroup,
  confirmDeleteGroup,
  confirmRenameGroup,
  startUploadMaterial,
  uploadMaterialFailure,
  uploadMaterialSuccess,
  deleteMaterial,
  renameMaterial,
  swapMaterialGroup,
} from '../action.js';

import PopoverModel from '../../../Component/Popover';
import Media from '../../../Component/Media';
import {uploadMediaUrl} from '../../../frontend';

import _ from 'lodash';

const { Sider, Content } = Layout;

class Picture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: '0',
      defaultGroups: [
        {
          _id: '0',
          name: '全部图片',
        },
        {
          _id: '1',
          name: '未分组',
        },
      ],
      groups: [],
      material: [],
      createGroupName: '',
      reGroupName: '',
    };
  }
  
  onSelectGroup = ({key}) => {
    const selectedName = _.find([...this.state.defaultGroups, ...this.props.groups], g => (g._id === key)).name;
    this.setState({selectedGroup: key, reGroupName: selectedName});
  }


  uploadMedia = info => {
    console.log(info.file);

    if (info.file.status === 'done') {
      if (info.file.response.created) {
        this.props.uploadSuccess(info.file.response._doc);
        message.success('上传图片成功');
      } else {
        this.props.uploadFailure();
      }
    } else if (info.file.status === 'error') {
      this.props.uploadFailure();
    } else if (info.file.state === 'upload') {
      this.props.startUpload();
    }
  }
  
  render() {
    const { groups, material, createGroup, deleteGroup, reNameGroup, updating, reNameMaterial, swapMaterialGroup, deleteMaterial } = this.props;
    const { defaultGroups, selectedGroup, createGroupName, reGroupName } = this.state;
    const allGroups = [...defaultGroups, ...groups];
    let selectedItem = _.find(allGroups, g => g._id === selectedGroup);
    selectedItem = selectedItem ? selectedItem : {_id: '0', name: '全部图片'};
    
    let showMaterial;
    if (selectedItem._id === '0') {
      showMaterial = material;
    } else if (selectedItem._id === '1') {
      showMaterial = material.filter(m => (
        _.findIndex(allGroups, g => (g._id === m.groupId)) <= 0
      ));
    } else {
      showMaterial = material.filter(m => m.groupId === selectedItem._id);
    }
    console.log(selectedGroup);
    return (
      <Spin spinning={updating} delay={800}>
      <Layout style={{backgroundColor: '#fff', margin: '1rem 0'}}>
          <Content style={{minHeight: 280, borderRight: 'solid 1px #e9e9e9', display: 'inline-block'}}>
            <div style={{marginBottom: '1rem', height: '28px'}}>
              <span style={{fontSize: '1rem', marginRight: '1rem', display: 'inline-block', maxWidth: '10rem', textOverflow:  'ellipsis', overflow: 'hidden', float: 'left'}}>{selectedItem.name}</span>
              {(selectedGroup.length === 1) ||
              <div style={{display: "inline-block"}}>
                <PopoverModel
                  title="编辑名称"
                  confirm={()=>reNameGroup(selectedGroup, reGroupName)}
                  content={(<Input placeholder="分组名称" value={reGroupName} onChange={e => this.setState({reGroupName: e.target.value})}/>)}
                >
                  <Button icon="edit">重命名</Button>
                </PopoverModel>
                <span style={{marginLeft:'1rem'}}></span>
                <PopoverModel
                  title="删除分组"
                  confirm={()=>deleteGroup(selectedGroup)}
                  content={(<div>仅删除分组，不删除图片</div>)}
                >
                  <Button icon="delete">删除分组</Button>
                </PopoverModel>
              </div>
              }
              <div style={{display: 'inline-block', float: 'right', marginRight: '1rem'}}>
                <Upload name="media" action={uploadMediaUrl} data={{type: 'picture', groupId: selectedGroup}} onChange={this.uploadMedia} showUploadList={false}>
                  <Button type="primary" icon="upload">上传图片</Button>
                </Upload>
              </div>
            </div>
            <div>
              {showMaterial.map(m => (
                <Media name={m.name} id={m._id} groups={groups} key={m._id} reNameMedia={reNameMaterial} swapMediaGroup={swapMaterialGroup} deleteMedia={deleteMaterial}>
                  <img alt={m.name} width="100%" height="168" src={m.url} style={{objectFit: 'cover'}}/>
                </Media>
              ))}
            </div>
          </Content>
          <Sider width={200} style={{minHeight: 280, backgroundColor: '#fff'}}>
            <Menu mode="vertical" defaultSelectedKeys={['0']} selectedKeys={[selectedItem._id]} style={{borderRightWidth: '0', textAlign: 'center'}} onSelect={this.onSelectGroup}>
              {allGroups.map(group => (
                <Menu.Item key={group._id}>{group.name}</Menu.Item>
              ))}
              <PopoverModel 
                title="新建分组"
                confirm={()=>(
                  createGroupName ?
                  createGroup(createGroupName, 'picture') :
                  message.error('分组名称不能为空')
                )}
                content={(<Input placeholder="分组名称" value={createGroupName}  onChange={(e) => this.setState({createGroupName: e.target.value})} /> )}
              >
                <Button type="primary" icon="folder-add">新建分组</Button>
              </PopoverModel>
            </Menu>
          </Sider>
      </Layout>
      </Spin>
    );
  }
};

export default connect(
  state => {
    const groups = state.material.groups.filter(g => g.type === 'picture');
    const material = state.material.material.filter(p => p.type === 'picture');
    const updating = state.material.updating;
    return { groups, material, updating };
  },
  dispatch => ({
    createGroup: (name, type) => { dispatch(confirmCreateGroup(name, type)) },
    deleteGroup: groupId => { dispatch(confirmDeleteGroup(groupId)) },
    reNameGroup: (groupId, newName) => { dispatch(confirmRenameGroup(groupId, newName)) },
    startUpload: () => { dispatch(startUploadMaterial()); },
    uploadSuccess: file => { dispatch(uploadMaterialSuccess(file)); },
    uploadFailure: () => { dispatch(uploadMaterialFailure()); },
    deleteMaterial: id => { dispatch(deleteMaterial(id)); },
    reNameMaterial: (id, newName) => { dispatch(renameMaterial(id, newName)); },
    swapMaterialGroup: (id, groupId) => { dispatch(swapMaterialGroup(id, groupId)); },
  })
)(Picture);