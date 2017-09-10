
import React from 'React'

import ReactDOM from 'react-dom';
import { Icon , Breadcrumb ,Menu, Button ,Dropdown , Badge,Tooltip } from 'antd'
import { Router, Route, Link, hashHistory } from 'react-router';
// import { connect } from 'react-redux'
import UserAvatar from '../../../components/UserAvatar.jsx';
import './header.less'





class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var _self = this;
    // console.log(this.props.articleInfo);
    var docInfo = this.props.docInfo||{};
    return (
            this.props.type ==='edit'?
              <div className="article-header">
                  <Link to={'/doc/'+this.props.params.path+'/'+this.props.params.id} className="header-back">
                    <Icon type="close" />
                  </Link>
                  <Breadcrumb separator=">" className="header-crumb">
                    <Breadcrumb.Item>
                      <Link to={'/doc/'+this.props.params.path} >
                        {docInfo.name}
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      {this.props.articleInfo.title}
                    </Breadcrumb.Item>
                  </Breadcrumb>

                 <div className="header-action">
                  <span className="header-action-item header-action-button">
                    <Button type="primary" onClick={this.props.publishArticle}>发 布</Button>
                  </span>
                 </div>
                 <div className="header-action">
                   {/* <Badge status="success" >

                   </Badge> */}
                  <ul className="header-action-online clearfix">
                     <li className="online">
                       <Tooltip placement="left" title={'me'}>
                         <Link to={"/user/"+this.props.userInfo.email} className="online-avatar">
                           <UserAvatar userInfo={this.props.userInfo}/>
                         </Link>
                         <span className="online-status online-status-online"></span>
                       </Tooltip>
                     </li>
                  </ul>
                 </div>
                </div>
                :
                // <div className="doc-head "
                //   style={{transform: 'translateY(-60px)'}}>
                 <div className="header clearfix">
                  <Breadcrumb separator=">" className="header-crumb">
                    <Breadcrumb.Item>
                      <Link to={'/explore'} className='logo'>
                        <img src="https://gw.alipayobjects.com/zos/rmsportal/GaKZvhiRdRIolMLdBtwX.png" />
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <Link to={'/doc/'+this.props.params.path} >
                        {docInfo.name}
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      {this.props.articleInfo.title}
                    </Breadcrumb.Item>
                  </Breadcrumb>

                  <div className="header-action">
                   <span className="header-action-item" style={{padding:'17px 20px 11px 20px'}}>
                     <Dropdown placement="bottomCenter" overlay={
                       <Menu>
                         <Menu.Item>
                           新建文档
                         </Menu.Item>
                         <Menu.Item>
                           演示
                         </Menu.Item>
                         <Menu.Item>
                           markdown
                         </Menu.Item>
                       </Menu>
                     }>
                       <Icon type="ellipsis" style={{fontSize:20}}/>
                     </Dropdown>

                   </span>
                   {this.props.isAuthority?
                     <span className="header-action-item  header-action-item-btn">
                       <Link to={'/doc/'+this.props.params.path+'/'+this.props.params.id+'/edit'} className="header-back">
                         <Button icon="edit" type="primary">编辑</Button>
                       </Link>
                     </span>
                     :null}
                  </div>
                 </div>
                // </div>
    );
  }
}
export default Header
