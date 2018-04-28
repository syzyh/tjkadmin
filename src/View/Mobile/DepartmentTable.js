import React, { Component } from 'react';

import { Table, Input, Popconfirm, message, Icon } from 'antd';

import './mobile.css';

import MediaSelector from '../../Component/MediaSelector';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: this.props.editable || false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value);
      } else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue });
        this.props.onChange(this.cacheValue);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
           nextState.value !== this.state.value;
  }
  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div>
        {
          editable ?
            <div>
              <Input
                value={value}
                onChange={e => this.handleChange(e)}
              />
            </div>
            :
            <div className="editable-row-text">
              {value.toString() || ' '}
            </div>
        }
      </div>
    );
  }
}

class DepartmentTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '缩略图',
      dataIndex: 'department_imgUrl',
      width: '10%',
      render: (text, record, index) => {
        if (this.state.data[index]['department_name'].editable) {
          return <img onClick={()=>this.setState({visible: true})} style={{display: 'block', margin: '-12px 0px', objectFit: 'cover', border: '1px dashed #108ee9', borderRadius: '6px'}} width="64px" height="64px" alt="test" src={this.state.data[index].department_imgUrl} />;
        } else {
          return <img style={{display: 'block', margin: '-12px 0px', objectFit: 'cover', borderRadius: '6px'}} width="64px" height="64px" alt="test" src={this.state.data[index].department_imgUrl} />;
        }
      },
    }, {
      title: '横幅图',
      dataIndex: 'department_imgUrl2',
      width: '10%',
      render: (text, record, index) => {
        if (this.state.data[index]['department_name'].editable) {
          return <img onClick={()=>this.setState({visible: true})} style={{display: 'block', margin: '-12px 0px', objectFit: 'cover', border: '1px dashed #108ee9', borderRadius: '6px'}} width="64px" height="64px" alt="test" src={this.state.data[index].department_imgUrl2} />;
        } else {
          return <img style={{display: 'block', margin: '-12px 0px', objectFit: 'cover', borderRadius: '6px'}} width="64px" height="64px" alt="test" src={this.state.data[index].department_imgUrl2} />;
        }
      },
    }, {
      title: '名称',
      dataIndex: 'department_name',
      width: '15%',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'department_name', text),
    }, {
      title: '地址',
      dataIndex: 'department_urlName',
      width: '35%',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'department_urlName', text),
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        const { editable } = this.state.data[index].department_name;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => {this.editDone(index, 'save')}}>保存</a>
                  <Popconfirm title="放弃现有的修改?" onConfirm={() => {
                    if (this.state.data[index]._id === '-1') {
                      const data = this.state.data.slice(0, -1);
                      this.setState({data});
                      this.props.createdCallback();
                    } else {
                      this.editDone(index, 'cancel');
                    }
                  }}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                :
                <span>
                  <a onClick={() => this.edit(index)}><Icon type="edit" style={{ fontSize: 16 }} /></a>
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

    const cacheData = [];
    this.props.data.forEach(item => {
      const cacheState = {};
      cacheState['_id'] = item._id;
      cacheState['department_imgUrl'] = item.department_imgUrl;
      cacheState['department_name'] = {
        editable: false,
        value: item.department_name
      };
      cacheState['department_urlName'] = {
        editable: false,
        value: item.department_urlName
      };
      cacheData.push(cacheState);
    });
    this.state = {
      data: cacheData,
      visible: false,
      editIndex: -1,
    };
  }
  componentWillReceiveProps(nextProps) {
    let data = [], hasNewData = false;

    if (nextProps.data !== this.props.data) {
      nextProps.data.forEach(item => {
        const cacheState = {};
        cacheState['_id'] = item._id;
        cacheState['department_imgUrl'] = item.department_imgUrl;
        cacheState['department_name'] = {
          editable: false,
          value: item.department_name
        };
        cacheState['department_urlName'] = {
          editable: false,
          value: item.department_urlName
        };
        data.push(cacheState);
      });
      hasNewData = true;
    }

    if (nextProps.creating && !this.props.creating) {
      const cacheData = data.length > 0 ? data : this.state.data;
      const data2 = [...cacheData, {
        _id: '-1',
        department_name: {
          editable: true,
          value: '',
        },
        department_imgUrl: '/public/uploads/f8cd19ce-b1aa-4b92-84c2-6c4b3ff6b919.jpeg',
        department_imgUrl2: '/public/uploads/f8cd19ce-b1aa-4b92-84c2-6c4b3ff6b919.jpeg',
        department_urlName: {
          editable: true,
          value: '',
        }
      }];
      this.setState({ data: data2, editIndex: data.length });
    } else {
      if (hasNewData) {
        this.setState({ data });
      }
    }
  }
  
  renderColumns(data, index, key, text) {
    const { editable, status } = data[index][key];
    if (typeof editable === 'undefined') {
      return text;
    }
    return (<EditableCell
      editable={editable}
      value={text}
      onChange={value => this.handleChange(key, index, value)}
      status={status}
    />);
  }
  handleChange(key, index, value) {
    const { data } = this.state;
    data[index][key].value = value;
    this.setState({ data });
  }
  edit(index) {
    const { data } = this.state;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = true;
      }
    });
    this.setState({ data, editIndex: index });
  }
  editDone(index, type) {
    const { data } = this.state;
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].status = type;
        data[index][item].editable = false;
      }
    });

    this.setState({data}, () => {
      if (this.state.data[index].department_name.value !== '' && this.state.data[index].department_urlName.value !== '') {
        const {_id, department_name, department_imgUrl, department_urlName} = this.state.data[index];
        if (this.state.data[index]._id === '-1') {
          this.props.create(this.props.categoryId, department_name.value, department_imgUrl, department_urlName.value);
        } else {
          this.props.update(_id, department_name.value, department_imgUrl, department_urlName.value)
        }
      } else {
        message.error('名称和地址不能为空，请输入内容后保存');
      }

      Object.keys(data[index]).forEach((item) => {
        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
          delete data[index][item].status;
        }
      });
      this.props.createdCallback();
      this.setState({ data, editIndex: -1 });
    });
  }
  render() {
    const { data } = this.state;
    const dataSource = data.map((item) => {
      const obj = {};
      Object.keys(item).forEach((key) => {
        obj[key] = (key === 'department_name' || key === 'department_urlName') ? item[key].value : item[key];
      });
      return obj;
    });

    const columns = this.columns;
    return (
        <div>
          <MediaSelector single onCancel={()=>{this.setState({visible: false})}} visible={this.state.visible} handleOK={(media, start, end)=>{
            const {data, editIndex} = this.state;
            data[editIndex]['department_imgUrl'] = media[0].url;
            this.setState({data: [...data], visible: false});
            }}
          />
          <Table bordered dataSource={dataSource} columns={columns} pagination={false} rowKey={record => record._id} />
        </div>
        )
  }
}

export default DepartmentTable;