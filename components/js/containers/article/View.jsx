import React from 'React'
import {Row,Col,Menu,Icon,Breadcrumb, Alert,Dropdown } from 'antd';
import { Router, Route, Link, hashHistory } from 'react-router';
import { updateArticleInfo , getArticleInfoFromEnd} from '../../actions/article'
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import marked from  '../../utils/tide-marked';
import Viewer from './comps/Viewer.jsx'
import Moment from 'moment';
import Header from './comps/Header.jsx';
import Sider from './comps/Sider.jsx';
import Anchor from './comps/Anchor.jsx';

import './view.less'

var scrollHeight_V = 0
class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code:"",
      scrollOver60:false,
    };
  }
  componentDidMount(){
    const { dispatch } = this.props
    var urlId = this.props.routeParams.id
    dispatch(getArticleInfoFromEnd(urlId));
    var _self = this;
    // console.log(window.scrollY);
    // console.log(scrollHeight_V);
    window.addEventListener('scroll', function(e) {
      if(window.scrollY>scrollHeight_V&&!_self.state.scrollOver60){
        _self.setState({scrollOver60:true});
      }
      else if(window.scrollY<scrollHeight_V&&_self.state.scrollOver60){
        _self.setState({scrollOver60:false})
      }
      scrollHeight_V = window.scrollY
    });
  }
  render() {
    var value = this.props.articleInfo.body||""
    var domValue = marked(value);
    return (
      <Row className="view-box-outermost">
        <div className={this.state.scrollOver60?"doc-head":"doc-head doc-head-affixed"}
          style={{transform: this.state.scrollOver60?'translateY(-60px)':'translateY(0px)'}}>
          <Header
            type="view"
            {...this.props}
            fatherDomRef={this.refs.wojiubuxin}
          />
        </div>
        <div className="doc-head doc-head-spacer"></div>
        <div className="article-view">
          <Sider type="view" {...this.props} scrollOver60={this.state.scrollOver60}/>
          <Anchor {...this.props} domValue={domValue} scrollOver60={this.state.scrollOver60}/>
          <Viewer {...this.props} domValue={domValue}/>
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
    isAuthority:article.isAuthority,
    docInfo:docs.docInfo,
    articleInfo:article.articleInfo,
  }
}


export default connect(mapStateToProps)(Content)
