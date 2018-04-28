import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Card, Modal, Icon, Button, Spin } from 'antd';

import _ from 'lodash';

import { getAllData } from '../View/Material/action';

const { Sider, Content } = Layout;

class MediaSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: '0',
      defaultGroups: [
        {
          _id: '0',
          name: '全部',
        },
        {
          _id: '1',
          name: '未分组',
        },
      ],
      groups: [],
      material: [],
    };
  }
  
  onSelectGroup = ({key}) => {
    this.setState({selectedGroup: key});
    this.props.selectAnotherGroup();
  }

  componentDidMount() {
    if (this.props.fetchingMaterial)
      this.props.getAllData();
  }
  
  render() {
    const { groups, material, type, selectedMedia, fetchingMaterial } = this.props;
    const { defaultGroups, selectedGroup } = this.state;
    const typeGroups = groups.filter(g => g.type === (type ? type : 'picture'));
    const typeMaterial = material.filter(m => m.type ===(type? type : 'picture'));

    const allGroups = [...defaultGroups, ...typeGroups];
    let selectedItem = _.find(allGroups, g => g._id === selectedGroup);
    selectedItem = selectedItem ? selectedItem : {_id: '0', name: '全部'};
    
    let showMaterial;
    if (selectedItem._id === '0') {
      showMaterial = typeMaterial;
    } else if (selectedItem._id === '1') {
      showMaterial = typeMaterial.filter(m => (
        _.findIndex(allGroups, g => (g._id === m.groupId)) <= 0
      ));
    } else {
      showMaterial = typeMaterial.filter(m => m.groupId === selectedItem._id);
    }

    return (
      <Spin spinning={fetchingMaterial} delay={500}>
      <Layout style={{backgroundColor: '#fff', margin: '1rem 0'}}>
          <Content style={{minHeight: 280, borderRight: 'solid 1px #e9e9e9', display: 'inline-block'}}>
            <div style={{marginBottom: '1rem', height: '28px'}}>
              <span style={{fontSize: '1rem', marginRight: '1rem', display: 'inline-block', maxWidth: '10rem', textOverflow:  'ellipsis', overflow: 'hidden', float: 'left'}}>{selectedItem.name}</span>
            </div>
            <div>
              {showMaterial.map(m => {
                const opacityValue = _.findIndex(selectedMedia, sm => sm._id === m._id) < 0 ? 0 : 0.5;
                if (type === 'audio') {
                  return (
                  <Card key={m._id} title={m.name} onClick={()=>this.props.clickMedia(m)} style={{width: 340, display: 'inline-block', margin: '0.5rem'}} bodyStyle={{padding: 0}}>
                    <div style={{textAlign: 'center'}}>
                      <audio controls name="media" style={{width: '100%'}}>
                        <source src={m.url} type={m.detailType} />>
                      </audio>
                      <div style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'black', opacity: opacityValue, top: '0px'}}>
                        <Icon type="check" style={{fontSize: '64px', color: 'white', lineHeight: '100%'}}/>
                      </div>
                    </div>
                  </Card>
                )
                } else if(type === 'video') {
                  return (
                  <Card key={m._id} title={m.name} onClick={()=>this.props.clickMedia(m)} style={{width: 340, display: 'inline-block', margin: '0.5rem'}} bodyStyle={{padding: 0}}>
                    <div style={{textAlign: 'center'}}>
                      <video controls name="media" height="240" style={{width: '100%'}}>
                        <source src={m.url} type={m.detailType} />>
                      </video>
                      <div style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'black', opacity: opacityValue, top: '0px'}}>
                        <Icon type="check" style={{fontSize: '64px', color: 'white', lineHeight: '100%'}}/>
                      </div>
                    </div>
                  </Card>
                  )
                } else {
                  return (
                  <Card key={m._id} title={m.name} onClick={()=>this.props.clickMedia(m)} style={{width: 170, display: 'inline-block', margin: '0.5rem'}} bodyStyle={{padding: 0}}>
                    <div style={{textAlign: 'center'}}>
                      <img alt={m.name} width="100%" height="168" src={m.url} style={{objectFit: 'cover'}}/>
                      <div style={{position: 'absolute', height: '168px', width: '100%', backgroundColor: 'black', opacity: opacityValue, top: '57px'}}>
                        <Icon type="check" style={{fontSize: '64px', color: 'white', lineHeight: '168px'}}/>
                      </div>
                    </div>
                  </Card>
                )
                }
              })}
            </div>
          </Content>
          <Sider width={200} style={{minHeight: 280, backgroundColor: '#fff'}}>
            <Menu mode="vertical" defaultSelectedKeys={['0']} selectedKeys={[selectedItem._id]} style={{borderRightWidth: '0', textAlign: 'center'}} onSelect={this.onSelectGroup}>
              {allGroups.map(group => (
                <Menu.Item key={group._id}>{group.name}</Menu.Item>
              ))}
            </Menu>
          </Sider>
      </Layout>
      </Spin>
    );
  }
};

const MediaShow = connect(
  state => {
    const groups = state.material.groups;
    const material = state.material.material;
    const fetchingMaterial = state.material.fetchingMaterial;
    return { groups, material, fetchingMaterial };
  },
  dispatch => ({
    getAllData: () => {dispatch(getAllData());},
  })
)(MediaSelector);

class MediaSelectorModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMedia: [],
      confirmLoading: false,
    }
  }


  handleClickMedia = m => {
    const {selectedMedia} = this.state;
    if (this.props.single) {
      if (_.findIndex(selectedMedia, media => media._id === m._id) >= 0) {
        this.setState({ selectedMedia: [] });
      } else {
        this.setState({ selectedMedia: [m] });
      }
    } else {
      const index = _.findIndex(selectedMedia, media => media._id === m._id);
      if (index >= 0) {
        selectedMedia.splice(index, 1);
        this.setState({ selectedMedia: [...selectedMedia] });
      } else {
        this.setState({ selectedMedia: [...selectedMedia, m] });
      }
    }
  }

  handleOk = () => {
    this.props.handleOK(this.state.selectedMedia,
      ()=>this.setState({confirmLoading: true}),
      ()=>this.setState({confirmLoading: false})
    );
  }

  render() {
    return (
    <Modal
      visible={this.props.visible}
      title='点击选择'
      onOk={this.handleOk}
      onCancel={this.props.onCancel}
      width={1000}
      footer={[
        <Button key="back" size="large" onClick={this.props.onCancel}>返回</Button>,
        <Button key="submit" disabled={this.state.selectedMedia.length === 0} type="primary" size="large" loading={this.state.confirmLoading} onClick={this.handleOk}>
          确认
        </Button>,
      ]}
    >
      <MediaShow type={this.props.type} clickMedia={this.handleClickMedia} selectedMedia={this.state.selectedMedia} selectAnotherGroup={()=>this.setState({selectedMedia: []})}/>
    </Modal>
    );
  }
}

export default MediaSelectorModel;