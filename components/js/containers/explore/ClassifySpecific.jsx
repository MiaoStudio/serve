
import React from 'React';
import {Row,Col,Menu,Icon,Button,Card,Tooltip} from 'antd';
import { connect } from 'react-redux'
import UserAvatar from '../../components/UserAvatar.jsx';
import { fetchSpecificClass } from '../../actions/control'
import { Router, Route, Link, hashHistory } from 'react-router';
import moment from 'moment'

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

class Index extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    var ename = this.props.params.ename
    dispatch(fetchSpecificClass(ename))
  }

  render() {
    var specificClass = this.props.specificClass;
    console.log(specificClass);
    var doclist = specificClass.doclist||[];
    var teamlist = specificClass.teamlist||[];

    return (
      <div>
        <Row className="content-header-standard">
          <Col span={18} offset={3} className="group-info" >
            <div className="group-info-text" style={{margin:0}}>
              <h2 className="group-name">{specificClass.name}</h2>
              <p className="group-desc">{specificClass.intro}</p>
            </div>
          </Col>
          <Col span={18} offset={3} className="group-tab">
            <div className="count">
              <span className="count-item">
                <span className="count-text">{specificClass.doclist?specificClass.doclist.length:0} 个仓库
                </span>
              </span>
              <span className="count-item">
                <span className="count-text">{specificClass.teamlist?specificClass.teamlist.length:0} 个团队
                </span>
              </span>
            </div>

          </Col>
        </Row>
        <Row style={{paddingTop:15}}>
          <Col span={18} offset={3} className="group-tab">
            <Row gutter={16}>
              <Col xs={{ span: 24}} sm={{ span: 16}} md={{ span: 17}} >
                <Card title="文档列表"
                  className="noPadding"
                >
                  <ul className="projects clearfix">
                    {doclist.length != 0?
                      doclist.map(function(item,index){
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
                <Card title="成员" className="noPadding" >

                  <ul className="group-members">
                    {teamlist.map(function(item,index){
                      return (
                        <li className="group-members-item" key={index}>
                          <Link to={"/group/"+item.path}>
                            <UserAvatar userInfo={item}/>
                            <span className="name">{item.teamName}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </Card>
              </Col>
            </Row>

          </Col>
        </Row>

      </div>

    );
  }
}


// export default Index
const mapStateToProps = state => {
  const { app , control } = state
  return {
    userInfo:app.userInfo,
    specificClass:control.specificClass,
    app:app
  }
}


export default connect(mapStateToProps)(Index)
