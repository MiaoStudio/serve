import React, { Component } from 'react';
import classNames from 'classnames';
import CM from 'codemirror/lib/codemirror';
import { connect } from 'react-redux'
import tools from '../../utils/tools'

import {Upload,message,Icon,Tooltip,Menu, Dropdown,Row,Col} from 'antd';



export default class Editor extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {

    };

  }

  componentDidMount () {
    const that = this;
    const { value, defaultValue } = this.props;
    const editorNode = this.refs.editor;
    this.codeMirror = CM.fromTextArea(editorNode, this.getOptions());
    this.codeMirror.on('change', this.codemirrorValueChanged.bind(this));
    this.codeMirror.on('cursorActivity', this.updateCursorState.bind(this));
    this.codeMirror.on('focus', this.handlePenFocus.bind(this, true));
    this.codeMirror.on('blur', this.handlePenFocus.bind(this, false));
    this.codeMirror.setValue(defaultValue || value || '');

  }

  componentWillReceiveProps(nextProps) {
    console.info(nextProps);

    if (this.codeMirror && nextProps.value !== undefined && this.codeMirror.getValue() !== nextProps.value) {
      this.codeMirror.setValue(nextProps.value);
      this.codeMirror.refresh();
      this.codeMirror.focus();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // if (nextState.isPreview !== this.state.isPreview) {
    //   const start_time = new Date();
    //   if (nextState.isPreview) {
    //     this.handleMarkedPreview(this.codeMirror.getValue());
    //   }
    //   console.info('渲染预览消耗 %s ms', new Date() - start_time);
    // }
  }
  handleMarkedPreview(value) {
    const that = this;
    this.setState({
      previewLoading: true,
    });
    if (value !== this.previewTmp) {

    }
  }




  getOptions () {
    const that = this;
    return Object.assign({
      mode: 'gfm',
      lineNumbers: false,
      lineWrapping: true,
      indentWithTabs: true,
      matchBrackets: true,
      autofocus: true,
      tabSize: 4,
    }, this.props.options);
  }

  updateCursorState () {

  }

  codemirrorValueChanged (doc, change) {
    if (change.origin != 'setValue') {
      const newValue = doc.getValue();
      this.setState({
        getCursorStart: this.codeMirror.getCursor('start'),
        getCursorEnd: this.codeMirror.getSelection('end'),
        selection: this.codeMirror.getSelection(),
      });
    }
  }

  handlePenFocus(focused) {
    if (this.codeMirror && focused) {
      this.codeMirror.focus();
    }
  }






  render () {
    const { value } = this.props;

    return (
            <Row gutter={16}>
              <Col span={7}>

              </Col>
              <Col span={17}>
                <div className="content" onClick={this.handlePenFocus.bind(this)}>
                  <textarea
                    ref="editor"
                    defaultValue={value}
                    autoComplete="off"
                  />
                </div>
              </Col>
            </Row>

    );
  }
}
