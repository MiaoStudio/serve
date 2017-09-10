import React from 'React'
import {Row,Col,Menu,Icon,Breadcrumb, Alert,Dropdown} from 'antd';
import { Router, Route, Link, hashHistory } from 'react-router';
import { updateArticleInfo , getArticleInfoFromEnd } from '../../actions/article'

import { connect } from 'react-redux'
import tools from '../../utils/tools'

import Moment from 'moment';
import Header from './comps/Header.jsx'
import Sider from './comps/Sider.jsx'

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
import './manage.less'
import Editor from './Editor.jsx'
class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code:"",
      // localCode:"",
    };
    this.localCode = '';
    this.localSlurm = '';
    this.localTitle = '';
  }
  componentDidMount(){
    const { dispatch } = this.props
    var urlId = this.props.routeParams.id
    dispatch(getArticleInfoFromEnd(urlId))
  }
  publishArticle(){
    console.log('haha我要发布');
    const { dispatch } = this.props
    const body = this.localCode?this.localCode:this.props.articleInfo.body;
    const slurm = this.localSlurm?this.localSlurm:this.props.articleInfo.slurm;
    const title = this.localTitle?this.localTitle:this.props.articleInfo.title;
    const _id = this.props.articleInfo._id;
    const status = 1;
    if(!/^[a-z0-9_][a-z0-9_]{1,}$/.test(slurm)){
      return message.error('只能输入小写字母、横线、下划线和点，至少 2 个字符')
    }
    else if(slurm.toLowerCase() == 'list'||slurm.toLowerCase() == 'toc'||slurm.toLowerCase() == 'setting'){
      return message.error('路径 '+slurm+' 为保留路径，请更换')
    }
    dispatch(updateArticleInfo({_id:_id,title:title,slurm:slurm,body:body,status:status}))
  }
  handleChange(value) {
    this.localCode = value
  }
  handleSlurm(slurm) {
    this.localSlurm = slurm
  }
  handleTitle(title) {
    this.localTitle = title
  }
  render() {
    console.log(this.props.isAuthority);
    
    return (
      <Row style={{paddingTop:60}}>

        <Header
          type="edit"
          {...this.props}
          publishArticle={this.publishArticle.bind(this)}
        />
        <div className="article-editor">
          <Sider type="edit" {...this.props}/>
          <Editor
          dispatch={this.props.dispatch}
          editorStatus={{splitView:false}}
          canModify={true}
          article={this.props.articleInfo}
          title={this.props.articleInfo.title}
          slurm={this.props.articleInfo.slurm}
          value={this.props.articleInfo.body}
          handleChange={this.handleChange.bind(this)}
          handleSlurm={this.handleSlurm.bind(this)}
          handleTitle={this.handleTitle.bind(this)}
          />
        </div>


      </Row>

    );
  }
}


const mapStateToProps = state => {
  const { app , code , routing,docs,article } = state
  return {
    userInfo:app.userInfo,
    routeProps:routing,
    docInfo:docs.docInfo,
    isAuthority:article.isAuthority,
    articleInfo:article.articleInfo,
  }
}


export default connect(mapStateToProps)(Content)
