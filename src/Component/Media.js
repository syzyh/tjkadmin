import React, { Component } from 'react';

import { Card, Button, Tooltip, Input, Radio } from 'antd';

import PopoverModel from './Popover';

class Media extends Component {
  constructor(props) {
    super(props);
    let width = (props.size === 'large' ? 356 : 170);
    this.state = {
      newName: props.name,
      selected: '',
      width: width,
    };
  }

  render() {
    const { newName, selected, width } = this.state;
    const { id, reNameMedia, swapMediaGroup, deleteMedia, groups} = this.props;

    return (
      <Card title={this.props.name} style={{width: width, display: 'inline-block', margin: '0.5rem'}} bodyStyle={{padding: 0}}>
        <div style={{textAlign: 'center'}}>{this.props.children}</div>
        <Button.Group style={{width: '100%', textAlign: 'center'}}>
          <PopoverModel
            content={(<div><Input placeholder="输入新的名称" value={newName} onChange={e => this.setState({newName: e.target.value})} /></div>)}
            confirm={()=>{reNameMedia(id, newName)}}
          >
            <Tooltip title="编辑名称">
              <Button icon="edit" style={{width: '33%'}}></Button>
            </Tooltip>
          </PopoverModel>
          <PopoverModel
            content={(
              <div>
                <Radio.Group onChange={e => {this.setState({selected: e.target.value})}} value={selected} style={{width: '100%'}}>
                  {groups.map(g => (<Radio value={g._id} key={g._id} style={{overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%'}}>{g.name}</Radio>))}
                </Radio.Group>
              </div>
            )}
            confirm={()=>{swapMediaGroup(id, selected)}}
          >
            <Tooltip title="移动分组">
              <Button icon="swap" style={{width: '34%'}}></Button>
            </Tooltip>
          </PopoverModel>
          <PopoverModel content={(<div>确定删除此素材吗？ </div>)} confirm={()=>{deleteMedia(id)}}>
            <Tooltip title="删除">
              <Button icon="delete" style={{width: '33%'}}></Button>
            </Tooltip>
          </PopoverModel>
        </Button.Group>
      </Card>
    );
  }
}

export default Media;