
import React from 'React';
import {Row,Col,Menu,Icon,Button,Card} from 'antd';
import { connect } from 'react-redux'
import { fetchSpecificClass } from '../../actions/control'
import { Router, Route, Link, hashHistory } from 'react-router';
import UserAvatar from '../../components/UserAvatar.jsx';
import moment from 'moment'
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

class Popular extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props
    dispatch(fetchSpecificClass('popular'))
  }

  render() {

    console.log(this.props.specificClass);
    var articlelist = this.props.specificClass.articlelist ||[];
    var doclist = this.props.specificClass.doclist ||[];
    return (
      <div>
        <Row>
            <Row gutter={16}>
              <Col xs={{ span: 24}} sm={{ span: 16}} md={{ span: 17}} >
                {articlelist.map(function(item,index){
                  return (
                    <div className="fresh-doc" key={index}>
                       <div className="fresh-doc-header">
                        <UserAvatar
                          userInfo={item.author}
                        />
                        <div className="fresh-doc-nav">
                         <div className="fresh-doc-info">
                          <Link to={"/user/"+item.author.email} target="_blank">{item.author.name}</Link>
                          <span className="fresh-doc-pub"><span>发布在</span></span>
                          <Link to={"/doc/"+item.doc_id.path} target="_blank">{item.doc_id.name}</Link>
                         </div>
                         <div className="fresh-doc-date">
                          {moment(item.meta.updateAt).format('YYYY-MM-DD HH:mm:ss')}
                         </div>
                        </div>
                       </div>
                       <div className="fresh-doc-main">
                        <div className="fresh-doc-content">
                         <h3 className="fresh-doc-title">
                           <Link to={"/doc/"+item.doc_id.path+'/'+item.slurm} target="_blank">
                           {item.title}
                           </Link>
                         </h3>
                         <div className="fresh-doc-summary">
                          {item.intro.length<110?item.intro:item.intro.substring(0,110)+' ...'}
                         </div>
                         <Link to={"/doc/"+item.doc_id.path+'/'+item.slurm}
                         target="_blank" className="fresh-doc-more">
                         查看更多
                         </Link>
                        </div>
                        <Link to={"/doc/"+item.doc_id.path+'/'+item.slurm}
                        target="_blank" className="fresh-doc-pic"
                        style={{backgroundImage:"url("+ item.cover +")"}}
                        >
                        </Link>
                       </div>
                       <div className="fresh-doc-footer">

                       </div>
                      </div>
                  )
                })}

              </Col>
              <Col xs={{ span: 24}} sm={{ span: 8}} md={{ span: 7}}>
                <Card title="推荐关注" className="noPadding">
                  {doclist.map(function(item,index){
                    return (
                      <Link to={"/doc/"+item.path}
                        key={index}
                        target="_blank"
                        className="fresh-book-item">
                        <div className="fresh-book-author">
                          <UserAvatar
                            userInfo={item.parentArray||{}}
                          />
                        </div>
                        <div className="fresh-book-nav">
                          <h3 className="fresh-book-name">{item.name}</h3>
                          <div className="fresh-book-description">
                            {item.intro}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </Card>

              </Col>
            </Row>
        </Row>
      </div>

    );
  }
}


// export default Popular
const mapStateToProps = state => {
  const { app , control } = state
  return {
    userInfo:app.userInfo,
    specificClass:control.specificClass,
    app:app
  }
}


export default connect(mapStateToProps)(Popular)
