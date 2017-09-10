
import React from 'React'
import {Row,Col,Badge,Card,Button,Icon,Tooltip} from 'antd'
import { Router, Route, Link, hashHistory ,browserHistory} from 'react-router';
import { updateParentInfo } from '../../actions/article'
import UserAvatar from '../../components/UserAvatar.jsx'
import { connect } from 'react-redux';
import moment from 'moment'

class Doc extends React.Component {
  constructor(props) {
    super(props);
  }

  creatNewDoc(obj){
    const { dispatch } = this.props
    dispatch(updateParentInfo(obj))
  }
  render() {
    console.log(this.props.groupInfo);
    var teamMember = this.props.groupInfo.teamMember ||[];
    return (
      <Row gutter={16}>
        <Col xs={{ span: 24}} sm={{ span: 16}} md={{ span: 17}} >
          <Card title="文档列表"
            className="noPadding"
            extra={this.props.isAuthority?<Button type="primary" style={{top:-4}}
            onClick={this.creatNewDoc.bind(this,this.props.groupInfo)}>
                                        新建文档
                                      </Button>:null} >
            <ul className="projects clearfix">
              {this.props.contentsList.length != 0?
                this.props.contentsList.map(function(item,index){
                // if(item.type === 'file'){
                  return (
                    <li className="projects-item" key={index}>
                      <h2 className="name">
                        <Link to={"/doc/"+item.path}
                        className="link"
                        >
                          {item.type==='document'?<Icon type="book" style={{color:'#999'}}/>:null}
                          <span className="name-text">{item.name}</span>
                          {item.share === 'false'?<span className="name-lock"><Icon type="lock" /></span>:null}

                        </Link>
                      </h2>
                      <p className="desc">{item.intro}</p>
                      <p className="time">{moment(item.meta.createAt).locale('en').fromNow()}</p>
                    </li>
                  )

              })
              :null
              }
            </ul>
          </Card>
        </Col>
        <Col xs={{ span: 24}} sm={{ span: 8}} md={{ span: 7}}>
          <Card title="成员" extra={<span>{teamMember.length||0}</span>} className="noPadding" >
            {teamMember.length>5?
              <ul className="group-members group-members-all clearfix">
                {teamMember.map(function(item,index){
                  return (
                    <li className="group-members-item-avatar" key={index}>
                      <Tooltip placement="top" title={item.name}>
                        <Link to={"/user/"+item.email}>
                          <UserAvatar userInfo={item}/>
                        </Link>
                      </Tooltip>

                    </li>
                  )
                })}

              </ul>
            :
            <ul className="group-members">
              {teamMember.map(function(item,index){
                return (
                  <li className="group-members-item" key={index}>
                    <Link to={"/user/"+item.email}>
                      <UserAvatar userInfo={item}/>
                      <span className="name">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            }
          </Card>
        </Col>
      </Row>
    );
  }
}


// export default Doc
const mapStateToProps = state => {
  const { app , routing , group} = state
  return {
    userInfo:app.userInfo,
    routeProps:routing,
    contentsList:group.groupInfo.docs || [],
    isAuthority:group.isAuthority,
    groupInfo:group.groupInfo
  }
}
export default connect(mapStateToProps)(Doc)
