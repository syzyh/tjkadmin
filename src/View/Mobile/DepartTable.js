import React, { Component } from 'react';
import { Table, Icon, Divider, Input, Popconfirm, Button } from 'antd';

import MediaSelector from '../../Component/MediaSelector';

class DepartTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '名称',
      dataIndex: 'department_name',
      width: '15%',
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
    },{
      title: '缩略图',
      dataIndex: 'department_imgUrl',
      width: '10%',
      render: (text, record, index) => {
        if (this.state.editIndex === index) {
          return <img onClick={()=>this.setState({imgVisible: true})} style={{display: 'block', margin: '-12px 0px', objectFit: 'cover', border: '1px dashed #108ee9', borderRadius: '6px'}} width="64px" height="64px" alt="test" src={this.state.edit_imgUrl} />;
        } else {
          return <img style={{display: 'block', margin: '-12px 0px', objectFit: 'cover', borderRadius: '6px'}} width="64px" height="64px" alt="test" src={text} />;
        }
      },
    }, {
      title: '横幅图',
      dataIndex: 'department_imgUrl2',
      width: '10%',
      render: (text, record, index) => {
        if (this.state.editIndex === index) {
          return <img onClick={()=>this.setState({imgVisible2: true})} style={{display: 'block', margin: '-12px 0px', objectFit: 'cover', border: '1px dashed #108ee9', borderRadius: '6px'}} width="64px" height="64px" alt="test" src={this.state.edit_imgUrl2} />;
        } else {
          return <img style={{display: 'block', margin: '-12px 0px', objectFit: 'cover', borderRadius: '6px'}} width="64px" height="64px" alt="test" src={text} />;
        }
      },
    },{
      title: '地址名称',
      dataIndex: 'department_urlName',
      width: '30%',
      render: (text, record, index) => {
        return (
          <div>
            {this.state.editIndex === index
              ? <Input style={{ margin: '-5px 0' }} value={this.state.editUrlName} onChange={e => this.setState({editUrlName: e.target.value})} />
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
                  <span style={{ marginRight: '8px' }}>|</span>
                  <Popconfirm title="确定放弃修改么?" onConfirm={() => this.cancel()}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                : 
                <span>
                  <a onClick={() => this.edit(index, record)}><Icon type="edit" style={{ fontSize: 16 }} /></a>
                  <span style={{ marginRight: '8px' }}>|</span>
                  <a onClick={() => this.props.delete(record._id)}><Icon type="delete" style={{ fontSize: 16 }} /></a>
                  <span style={{ marginRight: '8px' }}>|</span>
                  <a onClick={() => this.props.top(record._id)}><Icon type="to-top" style={{ fontSize: 16 }} /></a>
                </span>
            }
          </div>
        );
      },
    }];
    this.state = { 
      editIndex: -1,
      editName: '',
      edit_imgUrl: '',
      edit_imgUrl2: '',
      editUrlName: '',
      imgVisible: false,
      imgVisible2: false,
     };
    //this.cacheData = data.map(item => ({ ...item }));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.creating) {
      this.setState({editIndex: 0});
    }
  }

  edit(index, record) {
    this.setState({editIndex: index, editName: record.department_name, edit_imgUrl: record.department_imgUrl, edit_imgUrl2: record.department_imgUrl2, editUrlName: record.department_urlName});
  }
  save(id) {
    const { editName, editUrlName, edit_imgUrl, edit_imgUrl2 } = this.state;
    if(id === 'new') {
      this.props.create(this.props.categoryId, editName, edit_imgUrl, editUrlName, edit_imgUrl2);
    } else {
      this.props.update(id ,editName, edit_imgUrl, editUrlName, edit_imgUrl2);
    }
    this.setState({editIndex: -1, editName: '', edit_imgUrl: '', editUrlName: '', edit_imgUrl2: ''}); 
    this.props.createdCallback();
  }
  cancel() {
    this.setState({editIndex: -1, editName: '', edit_imgUrl: '', editUrlName: '', edit_imgUrl2: ''});
    this.props.createdCallback();
  }


  render() {
    const dataSource = [...this.props.data];
    if (this.props.creating) {
      dataSource.unshift({_id: 'new', department_name: '', department_imgUrl: '', department_urlName: '', department_imgUrl2: ''});
    }
    return (
      <div>
        <Table bordered pagination={false} columns={this.columns} dataSource={dataSource} rowKey="_id" />
        <MediaSelector single onCancel={()=>{this.setState({imgVisible: false})}} visible={this.state.imgVisible} handleOK={(media, start, end)=>{
          this.setState({edit_imgUrl: media[0].url, imgVisible: false},()=>console.log(this.state));
          }}
        />
        <MediaSelector single onCancel={()=>{this.setState({imgVisible2: false})}} visible={this.state.imgVisible2} handleOK={(media, start, end)=>{
          this.setState({edit_imgUrl2: media[0].url, imgVisible2: false},()=>console.log(this.state));
          }}
        />
      </div>
    );
  }
}

export default DepartTable;