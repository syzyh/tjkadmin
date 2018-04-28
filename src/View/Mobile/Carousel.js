import React, { Component } from 'react';

import MediaSelector from '../../Component/MediaSelector';

class Carousel extends Component {
  state = {
    visible: false,
  }
  
  render() {
    return (
      <div>
        <button onClick={()=>this.setState({visible: true})}>fasdfasd</button>
        <MediaSelector type="video" single onCancel={()=>{this.setState({visible: false})}} visible={this.state.visible} handleOK={(media, start, end)=>{
          start();
          setTimeout(() => {
            end();
          }, 2000);
          }}
        />
      </div>
    );
  }
}

export default Carousel;