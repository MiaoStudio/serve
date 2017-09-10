
import React from 'React'
import {Row,Col,Menu,Icon,Card,Tooltip} from 'antd';
import { connect } from 'react-redux'
import { Router, Route, Link, hashHistory } from 'react-router';
import { getMyDocumentsUserData } from '../../actions/app'
import tools from '../../utils/tools'
import C_Header from './C_Header.jsx'
import Content from './Content.jsx'

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    console.log('did',this.props);
    var email = this.props.routeParams.email
    const { dispatch } = this.props
    dispatch(getMyDocumentsUserData(email))
  }
  componentDidMount(){
    tools.fixDocumentName('我的文档')
    if(this.props.myDocumentsUserData.avatar){
      this.setState({avatar_url:this.props.myDocumentsUserData.avatar})
    }else{
      this.setState({avatar_name:this.props.myDocumentsUserData.name,avatar_color:this.props.myDocumentsUserData.avatar_color})
    }
  }
  componentWillReceiveProps(next){
    if(next.myDocumentsUserData.avatar){
      this.setState({avatar_url:next.myDocumentsUserData.avatar})
    }else{
      this.setState({avatar_name:next.myDocumentsUserData.name,avatar_color:next.myDocumentsUserData.avatar_color})
    }
  }
  componentDidUpdate(prevProps){
    const prevFolder = prevProps.routeProps.locationBeforeTransitions.pathname.split('/')[2] ||""
    const nextFolder = this.props.routeProps.locationBeforeTransitions.pathname.split('/')[2] || ""
    if(prevFolder != nextFolder){
      const { dispatch } = this.props
      dispatch(getMyDocumentsUserData(nextFolder))
    }
  }
  render() {
  	var height = document.body.clientHeight -50;
    var teamBelong = [];
    if(this.props.myDocumentsUserData.teamBelong){
      teamBelong = this.props.myDocumentsUserData.teamBelong
    }
    return (
      <Row style={{height: '100%'}}    >
        {/* <C_Header/> */}
	        {/* <Row style={{height: height,overflowY:'auto'}}> */}
          <Row>

			        <Col span={18} offset={3} style={{height:'100%',paddingTop:15}} >
                <Row gutter={16}>
                  <Col xs={{ span: 24}} sm={{ span: 8}} md={{ span: 7}}>
                    <Card title="个人信息" className="noPadding">
                      <div className="user-info-head">
                        {this.state.avatar_url?
                          <img className="avatar" src={this.state.avatar_url}
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
                        <h4 className="name">
                          <a href="javascript:;" target="_blank">
                          <span>
                            {this.props.myDocumentsUserData.name}
                            <small className="title">({this.props.myDocumentsUserData.title})</small>
                          </span></a>
                        </h4>
                        <p className="title"><span>{this.props.myDocumentsUserData.job}</span></p>
                      </div>
                      <div className="user-info-list">
                        <p><Icon type="mail" />{this.props.myDocumentsUserData.email}</p>
                        <p><Icon type="environment-o" />{this.props.myDocumentsUserData.location}</p>
                        <p><Icon type="usb" />{this.props.myDocumentsUserData.apartment}</p>
                      </div>
                      <div className="user-info-team">
                        <h5 className="title"><span>团队</span></h5>
                          <ul className="list clearfix">
                            {teamBelong.length>0?
                              teamBelong.map(function(item,index){
                                return (

                                  <li className="list-item" key={item.path}>
                                    <Tooltip placement="top" title={item.teamName}>
                                      <Link to={"/group/"+item.path}>
                                        <img src={item.avatar}/>
                                      </Link>
                                    </Tooltip>

                                  </li>
                                )
                              })
                            :null}

                          </ul>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={{ span: 24}} sm={{ span: 16}} md={{ span: 17}} >
                    <Content/>

                  </Col>
                </Row>



	        		</Col>

	        </Row>
          <style>{`
            .user-info-head {
                position: relative;
                padding: 20px 20px 12px 82px;
                min-height: 52px;
            }
            .user-info-head .avatar {
                position: absolute;
                top: 24px;
                left: 24px;
                width: 50px;
                height: 50px;
                border-radius: 25px 25px;
            }
            .user-info-head .avatar-text {
                position: absolute;
                top: 24px;
                left: 24px;
                width: 50px;
                height: 50px;
                border-radius: 25px 25px;
            }
            .user-info-head .name {
                padding: 4px 0;
            }
            .user-info-head .name a {
                font-size: 18px;
                padding-bottom: 8px;
                color: #303030;
            }
            .user-info-head .title {
                color: #666;
                font-weight: 400;
                min-height: 18px;
            }
            .user-info-list {
                line-height: 21px;
                font-size: 12px;
                padding: 12px 20px 24px;
            }
            .user-info-list p {
                position: relative;
                line-height: 18px;
                min-height: 18px;
                padding-left: 24px;
                padding-bottom: 6px;
                color: #666;
            }
            .user-info-list i {
                position: absolute;
                top: 2px;
                left: 0;
                font-size: 14px;
                color: #666;
                margin-right: 10px;
            }
            .user-info-team {
                border-top: 1px solid #e9e9e9;
                position: relative;
                padding: 20px 0 20px 20px;
            }
            .user-info-team .title {
                font-size: 14px;
                color: #303030;
                padding-bottom: 15px;
            }
            .user-info-team .list-item {
                float: left;
                width: 32px;
                height: 32px;
                margin: 10px 20px 10px 0;
                border-radius: 32px 32px;
            }
            .user-info-team .list-item a {
                display: block;
            }
            .user-info-team .list-item a img {
                width: 32px;
                height: 32px;
                border-radius: 32px 32px;
                background: #f9f9f9;
            }
          `}</style>
      </Row>

    );
  }
}


// export default Index
const mapStateToProps = state => {
  const { app, routing } = state
  return {
    userInfo:app.userInfo,
    myDocumentsUserData:app.myDocumentsUserData,
    routeProps:routing,
    app:app
  }
}


export default connect(mapStateToProps)(Index)
