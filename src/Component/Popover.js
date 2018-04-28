import React, { Component } from 'react';
import { Popover, Button } from 'antd';

class PopoverModel extends Component {
  state = {
    visible: false,
  }
  hide = () => {
    this.setState({
      visible: false,
    });
  }
  confirm = () => {
    this.props.confirm();
    this.hide();
  }
  handleVisibleChange = (visible) => {
    this.setState({visible});
  }
  
  render() {
    let width = this.props.modelWidth ? this.props.modelWidth : '12rem';
    
    return (
      <Popover
        content={(
          <div style={{width}}>
            {this.props.content}
            <Button type="primary" style={{marginTop: '10px'}} onClick={this.confirm}>确定</Button>
            <Button style={{marginTop: '10px', float: 'right'}} onClick={this.hide}>取消</Button>
          </div>
        )}
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        title={this.props.title}
        trigger="click"
        placement="bottom"
      > 
        {this.props.children}
      </Popover> 
    );
  }
}

export default PopoverModel;