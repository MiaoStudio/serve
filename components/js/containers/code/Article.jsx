import React from 'React'
import {Row,Col,Menu,Icon,Breadcrumb, Alert,Dropdown} from 'antd';
import { Router, Route, Link, hashHistory } from 'react-router';
import { fetchListById , returnCurrentIdState , deleteArticleAction, renameItemsAction , updateItemAction , returnContentState } from '../../actions/code'
import { connect } from 'react-redux'
import tools from '../../utils/tools'

import Moment from 'moment';


const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
import './Article.less'
import Editor from './Editor.jsx'
class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code:"",
      // localCode:"",
    };
    this.localCode = ''
  }
  componentDidMount(){


    console.log('did',this.props);
    const { dispatch } = this.props
    var urlId = this.props.routeParams.id
    dispatch(returnCurrentIdState(urlId))
    dispatch(fetchListById(urlId))



  }

  handleUpdateTitle(title) {
    const { results } = this.props;
    const { dispatch } = this.props
    if (title !== '' && title !== results.title) {
      dispatch(updateItemAction({_id:results._id,title:title}));
      document.title = `${title} | 编辑页面`;
    }
  }
  handleSync(){
     this.handleSave(this.localCode)

  }
  updateModifyStatus(type) {
    const statusDom = document.getElementsByClassName('J_modify_time_status')[0];
    if (statusDom) {
      if (type === 'syncing') {
        statusDom.className = 'J_modify_time_status time-sync time-sync-loading';
      } else if (type === 'synced') {
        statusDom.className = 'J_modify_time_status time-sync time-sync-done';
      } else if (type === 'sync') {
        statusDom.className = 'J_modify_time_status time-sync time-sync-changed';
      }
    }
  }
  handleSave(value){
    const { results } = this.props;
    const { dispatch } = this.props;
    this.updateModifyStatus('syncing');
    dispatch(updateItemAction({_id:results._id,content:value}));
    setTimeout(()=>{
      this.updateModifyStatus('synced')
    },1000)
  }
  handleChange(value) {
    const { dispatch , results } = this.props;
    console.log(results);
    console.log(results.content === value);
    this.localCode = value
    if (results.content === value) {
      this.updateModifyStatus('synced');
      results.content = value
    } else {
      this.updateModifyStatus('sync');
    }
    returnContentState(results)
  }
  dropdownControl(id,e){
    // console.log(id);
    // console.log(type);
    // console.log(e);
    if(e.key=='delete'){
      this.deleteItem(id)
    }


  }
  deleteItem(id){
    const { dispatch } = this.props
    dispatch(deleteArticleAction(id))
  }
  render() {
    console.info(this.props.results);
    return (
      <Row >


        
        <div id="editor-header">
          <a className="back" href="javascript:window.history.back(-1);">
            <Icon type="left" />
          </a>
          <span className="doc-name">{this.props.results.title}</span>
          <span className="doc-name time" id="J_modify_time">
            <span>最近保存于 {Moment(new Date(this.props.results.meta?this.props.results.meta.updateAt:"")).locale('zh-cn').fromNow()}</span>
            <span className="time-sync J_modify_time_status" onClick={this.handleSync.bind(this)}>

            </span>
          </span>
          <div className="right">
          <Dropdown overlay={
              <Menu onClick={this.dropdownControl.bind(this,this.props.results._id)}>
                <Menu.Item key={'exports'}>
                          <Icon type="download" />
                          <span> &nbsp;&nbsp;&nbsp;导出</span>
                </Menu.Item>
                <Menu.Item key={'delete'}>
                          <Icon type="delete" />
                          <span> &nbsp;&nbsp;&nbsp;删除</span>
                </Menu.Item>
                <Menu.Item key={'return'}>
                          <Link to={"/doc/list/"}>
                          <Icon type="rollback" />
                          <span> &nbsp;&nbsp;&nbsp;返回</span>
                          </Link>
                </Menu.Item>
              </Menu>
              }>
              <a className="ant-dropdown-link" href="#">
                <Icon type="ellipsis"  />
              </a>
            </Dropdown>
          </div>
        </div>


        {/* Toolbar部分 */}
        {/* 编辑部分 */}
        <Editor
        editorStatus={{splitView:false}}
        article={{data:{}}}
        canModify={true}
        // library={library}
        article={this.props.results}
        // loading={article.loaded}
        id={this.props.results._id}
        title={this.props.results.title}
        value={this.props.results.content}
        // defaultValue={article.data.content}
        // editorStatus={editor}
        onEditTitle={this.handleUpdateTitle.bind(this)}
        handleChange={this.handleChange.bind(this)}
        handleSave={this.handleSave.bind(this)}
        // handleSidebarAction={this.handleModifySidebarAction.bind(this)}
        // handleRevert={this.handleRevert.bind(this)}
        // handleModifyFileAction={this.handleModifyFileAction.bind(this)}
        // canModify={this.state.canModify}
        />
      </Row>

    );
  }
}


// export default Content
const mapStateToProps = state => {
  const { app , code , routing } = state
  return {
    userInfo:app.userInfo,
    routeProps:routing,
    results:code.results,
  }
}


export default connect(mapStateToProps)(Content)
