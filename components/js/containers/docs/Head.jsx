
import React from 'React'
import {Row,Col,Badge,Icon,Button} from 'antd'
import { connect } from 'react-redux';
import { Router, Route, Link, hashHistory } from 'react-router';
import { createArticle } from '../../actions/docs'
import Headers from './Head.jsx'

class Contents extends React.Component {
  constructor(props) {
    super(props);

    var path = this.props.path;
    this.state={
      path:path,
    }
  }
  componentDidMount(){

  }
  createNewArticle(){
    const { dispatch } = this.props
    console.log(this.props.docInfo._id);
    dispatch(createArticle({doc_id:this.props.docInfo._id,path:this.props.docInfo.path}))
  }
  render() {
    var who_active = this.props.routeProps.locationBeforeTransitions.pathname.split('/')[3] || "";
    var isShowMenu = this.props.docInfo.show_menu === 'true';
    // console.log(this.props.docInfo);
    // var isShowSetting;
    // if(this.props.docInfo.parentRef == "User"){
    //   isShowSetting = this.props.userInfo._id == this.props.docInfo.parentArray._id;
    // }
    // else{
    //   //第一步取出temamember中的_id,组成数组，在判断是否存在当前登录者_id；
    //   // console.log(this.props.docInfo.parentArray.teamMember.map(item=>item._id));
    //   // console.log(this.props.userInfo._id);
    //   // console.log(this.props.docInfo.parentArray.teamMember.map(item=>item._id).indexOf(this.props.userInfo._id));
    //   isShowSetting = this.props.docInfo.parentArray.teamMember.map(item=>item._id).indexOf(this.props.userInfo._id) != -1
    // }
    return (
      <Row className="content-header-standard">
        <Col span={18} offset={3} className="book-info">
            <span className="book-info-icon">
              {this.props.docInfo.type==='document'?<Icon type="book" style={{color:'#999'}}/>:null}
            </span>
            <Link to={

              this.props.docInfo.parentArray.path?'/group/'+this.props.docInfo.parentArray.path:'/user/'+this.props.docInfo.parentArray.email
            }>
              {this.props.docInfo.parentArray.name?this.props.docInfo.parentArray.name:this.props.docInfo.parentArray.teamName}
            </Link>
            <span className="book-info-split"> / </span>
            <Link to={"/doc/"+this.props.docInfo.path} className="book-info-text">
              {this.props.docInfo.name}
            </Link>
        </Col>
        {this.props.isAuthority?
          <div className="book-action">
            <Button type="primary" onClick={this.createNewArticle.bind(this)}>新建文档</Button>
          </div>
        :null}

        <Col span={18} offset={3} className="group-tab">
            <ul className="group-tab-list clearfix">
              {isShowMenu?
                <li>
                  <Link to={"/doc/"+this.state.path}
                  className={"group-tab-item "+(!who_active?"group-tab-item-active":"")}>
                    <span className="text">
                      <span>目录</span>
                    </span>
                  </Link>
                </li>
              :null}
              {!isShowMenu?
                <li>
                  <Link to={"/doc/"+this.state.path}
                  className={"group-tab-item " +(!who_active?"group-tab-item-active":"")}>
                    <span className="text">
                      <span>文档</span>
                    </span>
                  </Link>
                </li>
              :
                <li>
                  <Link to={"/doc/"+this.state.path+"/list"}
                  className={"group-tab-item " +(who_active=='list'?"group-tab-item-active":"")}>
                    <span className="text">
                      <span>文档</span>
                    </span>
                  </Link>
                </li>
              }
              {this.props.isAuthority?
                <li>
                  <Link to={"/doc/"+this.state.path+"/setting"}
                  className={"group-tab-item " +(who_active=='setting'?"group-tab-item-active":"")}>
                     <span className="text"><span>设置</span></span>
                  </Link>
                </li>
              :null}

            </ul>

        </Col>
        <style>{`

        `}</style>
      </Row>
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
