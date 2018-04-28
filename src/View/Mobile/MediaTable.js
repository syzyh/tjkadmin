import React, { Component } from 'react';
import { Table, Icon, Divider, Input, Popconfirm, Button } from 'antd';

import MediaSelector from '../../Component/MediaSelector';

class MediaTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '名称',
      dataIndex: 'audio_name',
      width: '12%',
      render: (text, record, index) => {
        return (
          <div>
            {this.state.editIndex === index
              ? <Input style={{ margin: '-5px 0' }} value={this.state.editName} onChange={e => this.setState({editName: e.target.value})} />
              : text
            }
          </div>
        )
      },
    }, {
      title: '音频视频',
      dataIndex: 'audio_url',
      width: '28%',
      render: (text, record, index) => {
        if (props.type === 'audio') {
          return (
            <div>
              {this.state.editIndex === index
                ? <audio controls name="media" style={{width: '100%'}} src={this.state.editUrl}></audio> : 
                  <audio controls name="media" style={{width: '100%'}} src={text}></audio>
              }
            </div>
          )
        } else if (props.type === 'video') {
          return (
            <div>
              {this.state.editIndex === index
                ? <video controls name="media" style={{width: '100%'}} height="120" src={this.state.editUrl}></video> : 
                  <video controls name="media" style={{width: '100%'}} height="120" src={text}></video>
              }
            </div>
          )
        }
      },
    },{
      title: '介绍图',
      dataIndex: 'audio_imgUrl',
      width: '10%',
      render: (text, record, index) => {
        if (this.state.editIndex === index) {
          return <img onClick={()=>this.setState({imgVisible: true})} style={{display: 'block', margin: '-12px 0px', objectFit: 'cover', border: '1px dashed #108ee9', borderRadius: '6px'}} width="64px" height="64px" alt="test" src={this.state.editImgUrl} />;
        } else {
          return <img style={{display: 'block', margin: '-12px 0px', objectFit: 'cover', borderRadius: '6px'}} width="64px" height="64px" alt="test" src={text} />;
        }
      },
    }, {
      title: '简介',
      dataIndex: 'audio_description',
      width: '25%',
      render: (text, record, index) => {
        return (
          <div>
            {this.state.editIndex === index
              ? <Input.TextArea rows={3} style={{ margin: '-5px 0' }} value={this.state.editDescription} onChange={e => this.setState({editDescription: e.target.value})} />
              : text
            }
          </div>
        )
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        const { editable } = record;
        return (
          <div className="editable-row-operations">
            {
              this.state.editIndex === index ?
                <span>
                  <a onClick={() => this.save(record._id)}>保存</a>
                  <a onClick={() => this.setState({visible: true})}>上传</a>
                  <Popconfirm title="确定放弃修改么?" onConfirm={() => this.cancel()}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                : 
                <span>
                  <a onClick={() => this.edit(index, record)}><Icon type="edit" style={{ fontSize: 16 }} /></a>
                  <span style={{ marginRight: '8px' }}>|</span>
                  <a onClick={() => this.props.deleteAudio(record._id)}><Icon type="delete" style={{ fontSize: 16 }} /></a>
                  <span style={{ marginRight: '8px' }}>|</span>
                  <a onClick={() => this.props.topAudio(record._id)}><Icon type="to-top" style={{ fontSize: 16 }} /></a>
                </span>
            }
          </div>
        );
      },
    }];
    this.state = { 
      editIndex: -1,
      editName: '',
      editDescription: '',
      editUrl: '',
      editImgUrl: '',
      visible: false,
      imgVisible: false,
     };
    //this.cacheData = data.map(item => ({ ...item }));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.creating) {
      this.setState({editIndex: 0});
    }
  }

  edit(index, record) {
    this.setState({editIndex: index, editName: record.audio_name, editDescription: record.audio_description, editUrl: record.audio_url});
  }
  save(id) {
    const { editName, editUrl, editImgUrl, editDescription } = this.state;
    if(id === 'new') {
      this.props.createAudio(this.props.departmentId, editName, editUrl, editImgUrl, editDescription, this.props.type);
    } else {
      this.props.updateAudio(id ,editName, editUrl, editImgUrl, editDescription);
    }
    this.setState({editIndex: -1,editName: '', editDescription: '', editUrl: '', editImgUrl: ''}); 
    this.props.created();
  }
  cancel() {
    this.setState({editIndex: -1, editName: '', editDescription: '', editUrl: '', editImgUrl: ''});
    this.props.created();
  }


  render() {
    const dataSource = [...this.props.data];
    console.log(dataSource);
    if (this.props.creating) {
      dataSource.unshift({_id: 'new', audio_name: '', audio_url: '', audio_description: '', audio_imgUrl: ''});
    }
    return (
      <div>
        <Table bordered pagination={false} columns={this.columns} dataSource={dataSource} rowKey="_id" />
        <MediaSelector type={this.props.type} single onCancel={()=>{this.setState({visible: false})}} visible={this.state.visible} handleOK={(media, start, end)=>{
          this.setState({editUrl: media[0].url, visible: false},()=>console.log(this.state));
          }}
        />
        <MediaSelector single onCancel={()=>{this.setState({imgVisible: false})}} visible={this.state.imgVisible} handleOK={(media, start, end)=>{
          this.setState({editImgUrl: media[0].url, imgVisible: false});
          }}
        />
      </div>
    );
  }
}

export default MediaTable;