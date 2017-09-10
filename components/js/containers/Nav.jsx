
import React from 'React'
import {Row,Col,Menu,Icon} from 'antd';
import { connect } from 'react-redux'
import { Router, Route, Link, hashHistory } from 'react-router';
import tools from '../utils/tools'
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleClick = (e) => {
    console.log('click ', e);
    if(e.key == 'logout'){
      this.logout();
    }
    // else if(e.key == 'chat'){
    //   // window.location.href = '/main/chat'
    //   window.location.pathname = '/main/chat'
    // }
    // else if(e.key == 'list'){
    //   // window.location.href = '/main/list'
    //   window.location.pathname = '/main/list'
    // }
  }
  logout(){
    console.log(`点击了`);
    tools.ajax({
         url: '/logout',
         method: 'GET',
         headers:{'Content-Type':'application/json'},
         async: true,
         dataType:'json'
     })
    .then(function (xhr) {
       window.location.href = '/signin'

    },
    function (e) {
      console.log(JSON.stringify(e))
    })
  }
  componentWillReceiveProps(next){
    if(next.userInfo.avatar){
      this.setState({avatar_url:next.userInfo.avatar})
    }else{
      this.setState({avatar_name:next.userInfo.name,avatar_color:next.userInfo.avatar_color})
    }
  }
  render() {
    return (
      <Row>
        <header>
          <Col span={18} offset={3} >
            <a href="/">
              <img className="logo" src="https://zos.alipayobjects.com/rmsportal/MgmOxgTzvxeOLCVgDsWq.png" />
            </a>
            <div className="header_right">
            <Menu
              defaultSelectedKeys={['code']}
              mode="horizontal"
              onClick={this.handleClick}
            >
              <Menu.Item key="list">

                <Link to="/explore">发现</Link>
              </Menu.Item>
              <Menu.Item key="chat">
                <Link to="/chat">交流</Link>
              </Menu.Item>
              <SubMenu className="user" title={
                <div style={{    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',}}>
                  <span className="img" style={{marginRight: 5}}>
                    {this.state.avatar_url?
                      <img className="avatar-image" src={'/upload/avatar/'+this.state.avatar_url}
                      width="30"
                      height="30"
                      style={{
                        verticalAlign:'middle'
                      }}
                      title="查看个人信息"/>
                      :
                      <div className="avatar-text"
                      style={{background:this.state.avatar_color}}>
                        {this.state.avatar_name?this.state.avatar_name.substr(0, 1).toLocaleUpperCase():""}
                      </div>
                    }
                  </span>
                  <span className="header_title">{this.props.userInfo.name} <span className="down_icon"></span></span>
                </div>
              } key="user">
                <Item key="a"><Link to="/mydesk">我的文档</Link></Item>
                {this.props.userInfo.role ===100?
                  <Item key="admin"><Link to="/admin">超级管理</Link></Item>
                :null}
                <Item key="b">修改密码</Item>
                <Item key="logout">退出登录</Item>
              </SubMenu>
            </Menu>
            </div>

          </Col>
        </header>
      </Row>

    );
  }
}


// export default Nav
const mapStateToProps = state => {
  const { app } = state
  return {
    userInfo:app.userInfo,
  }
}


export default connect(mapStateToProps)(Nav)
