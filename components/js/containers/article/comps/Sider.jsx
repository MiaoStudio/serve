
import React from 'React'
import { Icon , Breadcrumb , Button , Badge , Input,Tree } from 'antd'
import { Router, Route, Link, hashHistory } from 'react-router';
import classNames from 'classnames';
// import { connect } from 'react-redux'
import UserAvatar from '../../../components/UserAvatar.jsx';
import './sider.less'
import Moment from 'moment';
import { getArticleInfo , getArticleInfoFromEnd , deleteArticle} from '../../../actions/article'
import { createArticle } from '../../../actions/docs'


const TreeNode = Tree.TreeNode;
class Sider extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hideSider:false,
    };
  }
  componentDidMount(){

  }
  componentWillReceiveProps(nextProps){
    // console.error(nextProps);
  }
  componentWillUpdate(nextProps) {
  }
  selectArticle(slurm,url){
    const { dispatch } = this.props
    dispatch(getArticleInfo(slurm,url))

  }
  toggleSiderStatus(){
    this.setState({hideSider:!this.state.hideSider})
  }
  createNewArticle(){
    const { dispatch } = this.props
    console.log(this.props.docInfo._id);
    dispatch(createArticle({doc_id:this.props.docInfo._id,path:this.props.docInfo.path}))
  }
  deleteArticle(item){
    const { dispatch } = this.props
    dispatch(deleteArticle(item))

  }
  filterArticles(e){
    var kw = e.target.value||'';
    var res_articles = [];
    if(this.props.docInfo.article){
      this.props.docInfo.article.map(function(item){
        var format_ori = item.title.toLocaleLowerCase();
        if(format_ori.indexOf(kw.toLocaleLowerCase()) !== -1){
          res_articles.push(item)
        }
      })
    }
    this.setState({res_articles})
  }
  render() {
    var _self = this;
    // console.log(this.props);
    var docInfo = this.props.docInfo||{};
    var articles = docInfo.article||[];
    // console.log(this.state.cur_atricles);
    var cur_atricles = this.state.res_articles || articles;
    cur_atricles = cur_atricles.sort(function(a,b){
      return a.meta.updateAt < b.meta.updateAt
    })
    const active_slurm = this.props.articleInfo.slurm;


    const siderFirstClass = classNames({
      'doc-section': true,
      'doc-section-hide': this.state.hideSider?true:false,
      'doc-section-fixed':this.props.scrollOver60,
    });
    const siderButtonClass = classNames({
      'doc-section-toggle': true,
      'doc-section-toggle-hide': this.state.hideSider?true:false
    });
    return (
      this.props.type === 'edit'?
      <div className="editor-list editor-list-new-hide">
       <div className="editor-list-head">
        <h3 className="title"><span>文档</span></h3>
        <p className="desc">
          <span className="count"><span>共 {articles.length} 篇</span></span>
          <a className="action">
            <Icon type="plus" />
            <sapn className="text">
             <span onClick={this.createNewArticle.bind(this)}>新建文档</span>
            </sapn>
          </a>
        </p>
       </div>
       <div className="editor-list-filter">
        <Icon type="search" />
        <span className="editor-filter-input-wrap">
          <Input
            type="text"
            placeholder="搜索文档标题"
            onChange={this.filterArticles.bind(this)}
            className="ant-input ant-input-sm" />
        </span>
       </div>
       <div className="editor-list-body">
        <ul className="list">
          {cur_atricles.map(function(item,index){
            return (
              <li className="list-item" key={index}>
                <a className={active_slurm===item.slurm?"link link-current":"link"}
                  href="javascript:;"
                  onClick={_self.selectArticle.bind(_self,item.slurm,'/doc/'+_self.props.params.path+'/'+item.slurm+'/edit')}
                  // to={'/doc/'+_self.props.params.path+'/'+item.slurm+'/edit'}
                  >
                <span>
                  <h5 className="title">
                    <span className="title-text">
                      <span className="draft">
                        <span>{item.status?"":"[草稿]"}</span>
                      </span> {item.title}
                    </span>
                   </h5>
                   <p className="time clearfix">
                     <span className="slug">{item.slurm}</span>
                     <span className="updated">{Moment(new Date(item.meta?item.meta.updateAt:"")).locale('en').fromNow()}</span>
                   </p>
                 </span>
               </a>
               {active_slurm===item.slurm?null:
                 <a className="list-item-remove">
                    <Icon type="delete" style={{color:'red'}}
                      onClick={_self.deleteArticle.bind(_self,item)} />
                 </a>

               }
               </li>
            )
          })}


        </ul>
       </div>
      </div>
      :
      <div className={siderFirstClass}>
       <nav className="doc-section-nav">
         {docInfo.show_menu == 'true'?
           <Tree
          defaultExpandedKeys={['0-0-0', '0-0-1']}
          defaultSelectedKeys={['0-0-0', '0-0-1']}
          defaultCheckedKeys={['0-0-0', '0-0-1']}
          >
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="parent 1-0" key="0-0-0" disabled>
                <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
                <TreeNode title="leaf" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="parent 1-1" key="0-0-1">
                <TreeNode title={<span style={{ color: '#08c' }}>sss</span>} key="0-0-1-0" />
              </TreeNode>
            </TreeNode>
          </Tree>
           :
           <ul className="catalogs">
            {articles.map(function(item,indexxs){
              return (
                <li key={indexxs} className={active_slurm===item.slurm?"active":""}>
                  <span>
                    <a
                      href="javascript:;"
                      onClick={_self.selectArticle.bind(_self,item.slurm,'/doc/'+_self.props.params.path+'/'+item.slurm)}

                      >
                    <span className="name">{item.title}</span>
                   </a>

                   </span>
                 </li>
              )
            })}

            </ul>
         }

       </nav>
       <a className={siderButtonClass} href="javascript:;" onClick={this.toggleSiderStatus.bind(this)}><span></span></a>
      </div>

    );
  }
}
export default Sider
