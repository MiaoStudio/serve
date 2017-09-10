
import React from 'React'
import {Row,Col,Badge} from 'antd'
import { connect } from 'react-redux';
import { Router, Route, Link, hashHistory } from 'react-router';
import Headers from './Head.jsx'

class Contents extends React.Component {
  constructor(props) {
    super(props);
    // const { dispatch } = this.props
    // dispatch(updateUserInfo())
    var path = this.props.routeProps.locationBeforeTransitions.pathname.split('/')[2] || "";
    this.state={
      path:path,
    }
  }
  componentDidMount(){
    if(this.props.groupInfo.docs){
      this.setState({
        docsCount:this.props.groupInfo.docs.length,
        members:this.props.groupInfo.teamMember.length,
      })
    }
  }
  render() {
    var who_active = this.props.routeProps.locationBeforeTransitions.pathname.split('/')[3] || "";
    var docsCount = 0,
        members = 0;
    if(this.props.groupInfo.docs){
        docsCount = this.props.groupInfo.docs.length;
        members = this.props.groupInfo.teamMember.length;
    }
    return (
      <Row className="content-header-standard">
        <Col span={18} offset={3} className="group-info">
          <div className="group-avatar">
            <img  src={this.props.groupInfo.avatar}
            title="查看个人信息"/>

          </div>
          <div className="group-info-text">
            <h2 className="group-name">{this.props.groupInfo.teamName}</h2>
            <p className="group-desc">{this.props.groupInfo.intro}</p>
          </div>
        </Col>
        <Col span={18} offset={3} className="group-tab">
            <ul className="group-tab-list clearfix">
              <li>
                <Link to={"/group/"+this.state.path}
                className={"group-tab-item "+(!who_active?"group-tab-item-active":"")}>
                  <span className="text">
                    <span>文档</span>
                    {docsCount?
                      <Badge count={docsCount} style={{
                        marginLeft: '8px',
                        padding: '0 8px',
                        background: '#e2e2e2',
                        color: '#999',
                        display:'inline-block',
                      }} />
                    :null}

                  </span>
                </Link>
              </li>
              <li>
                <Link to={"/group/"+this.state.path+"/member"}
                className={"group-tab-item " +(who_active=='member'?"group-tab-item-active":"")}>
                  <span className="text">
                    <span>成员</span>
                    {members?
                      <Badge count={members} style={{
                        marginLeft: '8px',
                        padding: '0 8px',
                        background: '#e2e2e2',
                        color: '#999',
                        display:'inline-block',
                      }} />

                    :null}
                  </span>
                </Link>
              </li>
              {this.props.isAuthority?
                <li>
                  <Link to={"/group/"+this.state.path+"/setting"}
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
  const { app , routing , group} = state
  return {
    userInfo:app.userInfo,
    routeProps:routing,
    isAuthority:group.isAuthority,
    groupInfo:group.groupInfo
  }
}
export default connect(mapStateToProps)(Contents)
