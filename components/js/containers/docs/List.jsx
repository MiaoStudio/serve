
import React from 'React'
import {Row,Col,Badge,Icon,Button,Card,Modal} from 'antd'
import { connect } from 'react-redux';
import { Router, Route, Link, hashHistory } from 'react-router';
import './list.less'
import Moment from 'moment';
import { deleteArticle} from '../../actions/article'


class Contents extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){

  }
  deleteArticle(item){
    const { dispatch } = this.props
    dispatch(deleteArticle(item))
  }
  render() {
    console.log(this.props);
    var article = this.props.docInfo.article ||[]
    var path = this.props.params.path
    var _self = this
    return (
      <Card title="文档"
        className="noPadding">
        <ul className="docs-list">
          {article.map(function(item,index){
              return (
                <li className="docs-list-item" key={index}>
                 <div className="current clearfix">
                  <div className="img">
                   <Icon type="file-text" />
                  </div>
                  <div className="info info-inline clearfix">
                   <h5 className="info-name">
                     <Link to={'/doc/'+ path +'/'+item.slurm}>
                       <span className="title-text">
                       <span className="draft"><span>{item.status?"":"草稿"}</span></span>
                       {item.title}
                       </span>
                     </Link>
                   </h5>
                   <p className="info-time"><span className="larkicon larkicon-lock"></span></p>
                   <p className="info-time">{item.slurm}</p>
                   <p className="info-time">{Moment(new Date(item.meta?item.meta.updateAt:"")).locale('en').fromNow()}</p>
                  </div>
                  {_self.props.isAuthority?
                    <div className="action action-inline">
                      <Link to={'/doc/'+ path +'/'+item.slurm+'/edit'}  className="action-icon">
                        <Icon type="edit" />
                      </Link>
                     <a className="action-icon" href="javascript:;" onClick={_self.deleteArticle.bind(_self,item)}>
                       <Icon type="delete" />
                     </a>
                    </div>
                  :null}

                 </div>
               </li>
              )
          })}


         </ul>

      </Card>

    );
  }
}


// export default Contents
const mapStateToProps = state => {
  const { app , routing , group,docs} = state
  return {
    userInfo:app.userInfo,
    routeProps:routing,
    docInfo:docs.docInfo,
    isAuthority:docs.isAuthority,
  }
}
export default connect(mapStateToProps)(Contents)
