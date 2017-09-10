import React, { Component } from 'react';
import classNames from 'classnames';
import CM from 'codemirror/lib/codemirror';
import { getCursorState, applyFormat, insertAtCursor } from '../../utils/editorFormat';
import { connect } from 'react-redux'
import marked from  '../../utils/tide-marked';
import tools from '../../utils/tools'
// import Key from 'keymaster';
// var Key = require('keymaster')(document)
// import History from '../../components/Common/History';
import '../../../style/EditIcon.less';
import '../../../style/CodeMirror.less';
import { getImageFromClipboard } from '../../utils/upload';
// import { getCtokenFromCookie } from '@alipay/ajax/lib/utils';

import {Upload,message,Icon,Tooltip,Menu, Dropdown} from 'antd';

// const Dragger = Upload.Dragger;

require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/gfm/gfm');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
// require('codemirror/mode/diff/diff');
require('codemirror/mode/jsx/jsx');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/dockerfile/dockerfile');
require('codemirror/mode/go/go');
require('codemirror/mode/nginx/nginx');
require('codemirror/mode/shell/shell');
require('codemirror/mode/sql/sql');
require('codemirror/mode/swift/swift');
require('codemirror/mode/velocity/velocity');
require('codemirror/mode/yaml/yaml');
require('codemirror/mode/http/http');
require('codemirror/mode/clike/clike');
require('codemirror/addon/edit/continuelist');

export default class Editor extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isPreview: false,
      onScrolled: false,
      isFocused: false,
      title: '',
      cs: {},
      getCursorStart: {},
      getCursorEnd: {},
      selection: "",
      previewLoading: false,
      previewContnet: '',
    };

    this.previewTmp = '';
  }

  componentDidMount () {
    const that = this;
    const { value, defaultValue } = this.props;
    const editorNode = this.refs.editor;
    this.codeMirror = CM.fromTextArea(editorNode, this.getOptions());
    this.codeMirror.on('change', this.codemirrorValueChanged.bind(this));
    this.codeMirror.on('cursorActivity', this.updateCursorState.bind(this));
    this.codeMirror.on('paste', this.handlePasteEvent.bind(this));
    this.codeMirror.on('focus', this.handlePenFocus.bind(this, true));
    this.codeMirror.on('blur', this.handlePenFocus.bind(this, false));
    this.codeMirror.setValue(defaultValue || value || '');
    //
    // // 保存
    key('⌘+s, ctrl+s', function(e) {
      e.preventDefault();
      that.handleSave();
    });

    // 返回
    key('⌘+shift+left', function(e) {
      e.preventDefault();
      that.handleBack();
    });

    // 预览
    key('⌘+0, ctrl+0', function(e) {
      e.preventDefault();
      that.handlePreviewEvent();
    });
  }

  componentWillReceiveProps(nextProps) {
    console.info(nextProps);
    if (nextProps.title !== undefined && nextProps.title !== this.state.title) {
      this.setState({
        title: nextProps.title
      });
    }
    if (this.codeMirror && nextProps.value !== undefined && this.codeMirror.getValue() !== nextProps.value) {
      this.codeMirror.setValue(nextProps.value);
      this.codeMirror.refresh();
      // console.error(this.state.getCursorStart);
      // console.log(this.state.getCursorEnd);
      // try {
      //   this.codeMirror.setSelection(this.state.getCursorStart, this.state.getCursorEnd);
      // } catch (e) {
      //   console.log(e);
      // }
      this.codeMirror.focus();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.isPreview !== this.state.isPreview) {
      const start_time = new Date();
      if (nextState.isPreview) {
        this.handleMarkedPreview(this.codeMirror.getValue());
      }
      console.info('渲染预览消耗 %s ms', new Date() - start_time);
    }
    if (nextProps.canModify !== this.props.canModify) {
      this.codeMirror.setOption('readOnly', !nextProps.canModify);
    }
  }

  componentWillUnmount () {
    if (this.codeMirror) {
      this.codeMirror.setValue('');
      this.codeMirror.clearHistory();
      // http://stackoverflow.com/questions/18828658/how-to-kill-a-codemirror-instance
      this.codeMirror.toTextArea();
    }

    this.setState({
      isPreview: false,
      onScrolled: false,
      isFocused: false,
      title: '',
      cs: {},
    });

    key.unbind('⌘+s, ctrl+s');
    key.unbind('⌘+shift+left');
    key.unbind('⌘+0, ctrl+0');
  }

  handleMarkedPreview(value) {
    const that = this;
    this.setState({
      previewLoading: true,
    });
    if (value !== this.previewTmp) {
      tools.ajax({
           url: '/api/article/update',
           method: 'POST',
           data:JSON.stringify({_id:this.props.id,content:value}),
           headers:{'Content-Type':'application/json'},
           async: true,
           dataType:'json'
       })
      .then(function (xhr) {
        if(!xhr.response){
          return message.error('请求错误')
        }
        if(xhr.response.results){
            // return dispatch(returnResultsState(xhr.response.results))
            that.setState({
             previewContent: marked(xhr.response.results.content),
             previewLoading: false,
           });
           that.previewTmp = value;
        } else {
          // 走客户端渲染
          that.setState({
            previewContent: marked(value),
            previewLoading: false,
          });
        }
      },
      function (e) {
        console.log(JSON.stringify(e))
        that.setState({
          previewContent: marked(value),
          previewLoading: false,
        });
      })
      // ajax({
      //   url: '/api/docs/markup',
      //   data: {
      //     value,
      //   },
      //   success: (res) => {
      //     if (res.state === 'ok') {
      //       that.setState({
      //         previewContent: res.data,
      //         previewLoading: false,
      //       });
      //       this.previewTmp = value;
      //     } else {
      //       // 走客户端渲染
      //       that.setState({
      //         previewContent: marked(value),
      //         previewLoading: false,
      //       });
      //     }
      //   },
      //   error: () => {
      //     that.setState({
      //       previewContent: marked(value),
      //       previewLoading: false,
      //     });
      //   },
      //   method: 'POST',
      // });
    } else {
      that.setState({
        previewLoading: false,
      });
    }
  }

  handleBack() {
    const { article, library, history } = this.props;
    if (article.parent) {
      history.pushState(null, `l/${library.data.objectId}/f/${article.parent.objectId}`);
    } else {
      if (library.data.type === 'private') {
        history.pushState(null, 'desktop');
      } else {
        history.pushState(null, 'library');
      }
    }
  }


  getOptions () {
    const that = this;
    const { canModify } = this.props;
    return Object.assign({
      mode: 'gfm',
      lineNumbers: false,
      lineWrapping: true,
      indentWithTabs: true,
      matchBrackets: true,
      autofocus: true,
      tabSize: 2,
      readOnly: !canModify,
      extraKeys: {
        "Enter": "newlineAndIndentContinueMarkdownList",
        "Cmd-S": function() {
          that.handleSave();
          return false
        },
        "Cmd-B": function() {
          that.toggleFormat('bold');
        },
        "Cmd-I": function() {
          that.toggleFormat('italic')
        },
        "Cmd-1": function() {
          that.toggleFormat('h1');
        },
        "Cmd-2": function() {
          that.toggleFormat('h2');
        },
        "Cmd-3": function() {
          that.toggleFormat('h3');
        },
        "Cmd-Alt-U": function() {
          that.toggleFormat('uList');
        },
        "Cmd-Alt-O": function() {
          that.toggleFormat('oList');
        },
        "Cmd-Alt-G": function() {
          that.toggleFormat('del');
        },
        "Cmd-Alt-C": function() {
          that.toggleFormat('code');
        },
        "Cmd-Alt-E": function() {
          that.toggleFormat('quote');
        },
        "Cmd-Alt-L": function() {
          that.toggleFormat('link');
        },
        "Cmd-Alt-P": function() {
          that.toggleFormat('image');
        },
        "Cmd-0": function() {
          that.handlePreviewEvent();
        }
      }
    }, this.props.options);
  }

  updateCursorState () {
    this.setState({ cs: getCursorState(this.codeMirror) });
  }

  codemirrorValueChanged (doc, change) {
    const { handleChange } = this.props;
    if (handleChange && change.origin != 'setValue') {
      const newValue = doc.getValue();
      this.setState({
        getCursorStart: this.codeMirror.getCursor('start'),
        getCursorEnd: this.codeMirror.getSelection('end'),
        selection: this.codeMirror.getSelection(),
      });
      handleChange(newValue);
    }
  }

  toggleFormat (formatKey) {
    const { canModify } = this.props;
    if (this.state.isPreview) {
      return;
    }
    if (canModify) {
      applyFormat(this.codeMirror, formatKey);
    }
  }

  renderIcon (icon) {
    return <span className={'edit-icon edit-icon-'+ icon} />;
  }

  renderButton(formatKey, label, action) {
    const { canModify } = this.props;
    if (!action) {
      action = this.toggleFormat.bind(this, formatKey);
    }
    const className = classNames('docs-editor-tool-icon',
      {
        'docs-editor-tool-icon-active': this.state.cs[formatKey],
        'docs-editor-tool-icon-disabled': this.state.isPreview || !canModify
      },
      ('docs-editor-tool-icon-' + formatKey));
    return (
      <Tooltip title={label} placement="bottom">
        <button className={className} onClick={action}>
          { this.renderIcon(formatKey) }
        </button>
      </Tooltip>
    );
  }

  handleScrollEditor() {
    // 只在临界值发生变化
    if (this.refs.editorContainer.scrollTop > 0 && !this.state.onScrolled) {
      this.setState({ onScrolled: true });
    } else if (this.refs.editorContainer.scrollTop < 10) {
      this.setState({ onScrolled: false });
    }
  }

  renderToolbar () {
    const { canModify, article } = this.props;

    const previewClassName = classNames({
      'edit-icon': true,
      'edit-icon-eyes': !this.state.isPreview,
      'edit-icon-eyes-slash': this.state.isPreview
    });

    const previewIconActive = classNames({
      'docs-editor-tool-icon': true,
      'docs-editor-tool-icon-active': this.state.isPreview || !canModify
    });

    const historyClassName = classNames({
      'docs-editor-tool-icon': true,
      'docs-editor-tool-icon-disabled': this.state.isPreview || !canModify
    });

    const menu = (
      <Menu style={{transform:"translateX(-8px)",width: "110px"}} onClick={this.handleModifyItem.bind(this)}>
        <Menu.Item key="page">
          <a href={`/docs/a/${article._id}`} target="_blank">
            <Icon type="file-text" /><span className="docs-dropdown-text">阅读页面</span>
          </a>
        </Menu.Item>
        <Menu.Item key="history"><Icon type="clock-circle-o" /><span className="docs-dropdown-text">操作历史</span></Menu.Item>
      </Menu>
    );

    return (
      <div className="docs-editor-tool-list">
        <Tooltip title="撤销 (Cmd+U)" placement="bottom">
          <button className={historyClassName} onClick={this.handleUndo.bind(this)}>
            <span className="edit-icon edit-icon-undo" />
          </button>
        </Tooltip>
        <Tooltip title="重做 (Cmd+Shift+U)" placement="bottom">
          <button className={historyClassName} onClick={this.handleRedo.bind(this)}>
            <span className="edit-icon edit-icon-redo" />
          </button>
        </Tooltip>
        <span className="docs-editor-tool-separator" />
        {this.renderButton('h1', 'H1 (Cmd+1)')}
        {this.renderButton('h2', 'H2 (Cmd+2)')}
        {this.renderButton('h3', 'H3 (Cmd+3)')}
        <span className="docs-editor-tool-separator" />
        {this.renderButton('bold', '粗体 (Cmd+B')}
        {this.renderButton('italic', '斜体 (Cmd+I)')}
        {this.renderButton('del', '删除线 (Cmd+Alt+G)')}
        {this.renderButton('quote', '引用 (Cmd+Alt+E)')}
        {this.renderButton('code', '代码 (Cmd+Alt+C)')}
        <span className="docs-editor-tool-separator" />
        {this.renderButton('oList', '有序列表 (Cmd+Alt+O)')}
        {this.renderButton('uList', '无序列表 (Cmd+Alt+U)')}
        <span className="docs-editor-tool-separator" />
        {this.renderButton('link', '超链接(Cmd+Alt+L)')}
        { canModify &&
          <span>
            <Upload {...this.getUploadProps()}>
              {this.renderButton('image', '图片 (Cmd+Alt+P)', function(){})}
            </Upload>
            <Upload {...this.getUploadProps()}>
              {this.renderButton('attachment', '附件 (Cmd+Alt+L)', function(){})}
            </Upload>
          </span>
        }
        { !canModify &&
          <span>
            {this.renderButton('image', '图片 (Cmd+Alt+P)', function(){})}
            {this.renderButton('attachment', '附件 (Cmd+Alt+L)', function(){})}
          </span>
        }
        <span className="docs-editor-tool-separator" />
        <Tooltip placement="bottom" title="预览 (Cmd+0)">
          <button className={previewIconActive} onClick={this.handlePreviewEvent.bind(this)}>
            预览 <span className={previewClassName}></span>
          </button>
        </Tooltip>
        <Dropdown overlay={menu} trigger={['click']}>
          <button className='docs-editor-tool-icon'>
            查看 <span className="arrow-down" />
          </button>
        </Dropdown>
      </div>
    );
  }

  handleModifyItem(item) {
    const { handleModifyFileAction } = this.props;
    handleModifyFileAction(item.key);
  }

  handlePenFocus(focused) {
    if (this.codeMirror && focused) {
      this.codeMirror.focus();
    }
  }

  handleEditTitle() {
    this.setState({
      title: this.refs.title.value
    });
  }

  handleSubmitTitle() {
    const { onEditTitle } = this.props;
    this.state.title = this.state.title || '无标题';
    onEditTitle(this.state.title);
  }

  handlePreviewEvent() {
    this.setState({
      isPreview: !this.state.isPreview
    });
  }

  handleSave() {
    const { handleSave, canModify } = this.props;
    const value = this.codeMirror.getValue();
    if (value && canModify) {
      handleSave && handleSave(value);
    }
  }

  handleUndo(e) {
    e.preventDefault();
    if (this.codeMirror && !this.state.isPreview) {
      this.codeMirror.undoSelection();
    }
  }

  handleRedo(e) {
    e.preventDefault();
    if (this.codeMirror && !this.state.isPreview) {
      this.codeMirror.redoSelection();
    }
  }

  getUploadProps() {
    const cm = this.codeMirror;
    return {
      name: 'file',
      action: `/api/article/image`,
      showUploadList: false,
      dataType: 'json',
      onChange: function(data) {
        console.log(data);
        const { response } = data.file;
        const type = data.file.type.indexOf('image') === -1 ? 'link' : 'image';
        if(response && response.success) {
          insertAtCursor(cm, response.result.url, type, data.file.name);
        } else if (response && response.error) {
          message.error(response.msg, 3);
        }
      }
    }
  }

  handlePasteEvent(instance, e) {
    const { canModify } = this.props;
    if(e.clipboardData && e.clipboardData.items && canModify) {
      const file = getImageFromClipboard(e.clipboardData.items);
      if(file) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file.getAsFile(), 'image.jpg');
        // console.log(formData);
        // console.log(file.getAsFile());
        const ajaxProps = this.getUploadProps();
        const hide = message.loading('图片上传中...', 2);
        tools.ajax({
             url: ajaxProps.action,
             method: 'POST',
             data:formData,
            //  headers:{'Content-Type':'application/json'},
             async: true,
             dataType:ajaxProps.dataType,
             processData: false,
         })
        .then(function (xhr) {
          if(!xhr.response){
            return message.error('请求错误')
          }
          if(xhr.response.result){
            message.success('上传成功')
            insertAtCursor(instance, xhr.response.result.url, 'image');
            hide();
          }
        },
        function (e) {
          hide();
          message.error('上传图片失败, 请稍后再试', 3);

        })
        // ajax({
        //   url: ajaxProps.action,
        //   data: formData,
        //   dataType: ajaxProps.dataType,
        //   success: (res) => {
        //     const { data, state } = res;
        //     if (state === 'ok') {
        //       insertAtCursor(instance, data.url, 'image');
        //       hide();
        //     }
        //   },
        //   error: () => {
        //     hide();
        //     message.error('上传图片失败, 请稍后再试', 3);
        //   },
        //   method: 'POST',
        //   processData: false,
        // });
      }
    }
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  handleRevert(item) {
    const { handleRevert } = this.props;
    handleRevert(item);
  }

  render () {
    const { className, article, editorStatus, handleSidebarAction, value, canModify } = this.props;

    const editorLayoutClassName = classNames({
      'docs-editor': true,
      'docs-editor-split': editorStatus.splitView,
    });

    const editorSidebarClassName = classNames({
      'docs-editor-sidebar': true,
      'docs-editor-sidebar-show': editorStatus.splitView,
    });

    const editorClassName = classNames({
      'docs-editor-wrap': true,
      'docs-editor-wrap-preview': this.state.isPreview,
      [className]: className
    });

    const editorToolClassName = classNames({
      'docs-editor-tool': true,
      'docs-editor-tool-active': this.state.onScrolled,
    });

    const penClassName = classNames({
      'pen': true,
      'pen-hide': this.state.isPreview
    });

    const viewClassName = classNames({
      'view': true,
      'view-show': this.state.isPreview
    });

    const containerClassName = classNames({
      'docs-editor-container': true,
      'clearfix': true,
      'docs-editor-container-preview': this.state.isPreview
    });

    return (
      <div className={editorLayoutClassName}>
        <div className={editorToolClassName}>
        {this.renderToolbar()}
        </div>
        <div className="dragger-wrapper">
          {/* <Dragger {...this.getUploadProps()}> */}
            <div className={editorClassName}
            onScroll={this.handleScrollEditor.bind(this)}
            ref="editorContainer"
            onClick={this.stopPropagation}
            onKeyDown={this.stopPropagation}>

              <div className={containerClassName}>
                { article.loading &&
                  <div className="loading">
                    <Icon type="loading" />
                  </div>
                }
                <div className={penClassName}>
                  <div className="title">
                    <input
                      type="text"
                      ref="title"
                      className="title-edit"
                      value={this.state.title}
                      // defaultValue={this.state.title}
                      onChange={this.handleEditTitle.bind(this)}
                      onBlur={this.handleSubmitTitle.bind(this)}
                      autoComplete="off"
                      placeholder="无标题"
                      disabled={!canModify}
                    />
                  </div>
                  <div className="content" onClick={this.handlePenFocus.bind(this)}>
                    <textarea
                      ref="editor"
                      defaultValue={value}
                      autoComplete="off"
                    />
                  </div>
                </div>
                {this.state.isPreview &&
                  <div className={viewClassName}>
                    <h1 className="title">
                      <span className="title-edit">{article.title}</span>
                    </h1>
                    { this.state.previewLoading &&
                      <div className="loading">
                        <Icon type="loading" />
                      </div>
                    }
                    { !this.state.previewLoading &&
                      <div className="typo typo-github" dangerouslySetInnerHTML={{__html: this.state.previewContent}} />
                    }

                  </div>
                }
              </div>
              <div className="docs-editor-footer clearfix">
                <p>文由汝心生 · 笔墨云雀来</p>
              </div>
              {/* <div className={editorSidebarClassName}>
                <div className="docs-editor-sidebar-history">
                  <div className="title">
                    <span>操作历史</span>
                    <a className="title-action" onClick={handleSidebarAction}>
                      <Icon type="cross" />
                    </a>
                  </div>
                  <div className="list">
                    <History
                      handleRevert={this.handleRevert.bind(this)}
                      canModify={canModify}
                    />
                  </div>
                </div>
              </div> */}
            </div>
          {/* </Dragger> */}
        </div>
      </div>
    );
  }
}
