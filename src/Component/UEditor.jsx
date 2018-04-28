import React from 'react';
import { Spin } from 'antd';

// import createScript from './createScript';

class UEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  // loadUE() {
  //   const url = `/public/js/ueditor.all.min.js`;
  //   const configUrl = `/public/js/ueditor.config.js`;
  //   const langUrl = `/public/js/zh-cn.js`;

  //   // 顺序很重要~
  //   createScript(configUrl, () => {
  //     createScript(url, () => {
  //       createScript(langUrl, this.initUE);
  //     });
  //   });
  // }

  initXiuMi(baseURL) {
    window.UE.registerUI('dialog', (editor, uiName) => {
      return new window.UE.ui.Button({
        name: 'xiumi-connect',
        title: '秀米',
        onclick() {
          const dialog = new window.UE.ui.Dialog({
            iframeUrl: `${baseURL}xiumi-ue-dialog-v5.html`,
            editor,
            name: 'xiumi-connect',
            title: '秀米图文消息助手',
            cssRules: `width: ${window.innerWidth - 60}px; height: ${window.innerHeight - 60}px;`,
          });

          dialog.render();
          dialog.open();
        },
      });
    });
  }

  initUE() {
    // const baseURL = `/webpage/p/ueditor/`;

    // if (this.props.withXiumi) {
    //   this.initXiuMi(baseURL);
    // }

    // UE.delEditor('container');
    const ue = this.ue = window.UE.getEditor('container');

    ue.ready(() => {
      if (this.props.content) {
        ue.setContent(this.props.content);
      }

      this.setState({ loading: false });
    });
  }

  componentDidMount() {
    // if (!window.UE) {
    //   this.loadUE();
    //   this.setState({ loading: true });
    // } else {
      this.initUE();
    // }
  }

  componentWillUnmount() {
    // 一定要写这一句
    this.ue.destroy();
  }

  render() {
    return (
      <div style={{ lineHeight: 1 }}>
        { this.state.loading ? <Spin /> : null}
        <script id="container" name="content" type="text/plain" />
      </div>
    );
  }
}

UEditor.defaultProps = {
  content: '',
  width: 375,
  height: 250,
  withXiumi: false,
  inModal: false,
};

export default UEditor;
