
import React from 'React'
import {Row,Col,Tabs,Badge,Spin} from 'antd'
import { connect } from 'react-redux';
import Headers from './Head.jsx'
import { getGroupInfo , returnGroupInfoState  } from '../../actions/group'
import './group.less'
import Doc from './Doc.jsx'
const TabPane = Tabs.TabPane;

class Contents extends React.Component {
  constructor(props) {
    super(props);
    var path = this.props.routeParams.path
    const { dispatch } = this.props
    dispatch(getGroupInfo(path))
  }
  componentWillUnmount() {
    console.log('卸载');
    const { dispatch } = this.props;
    dispatch(returnGroupInfoState([]));

  }
  render() {
    var who_active = this.props.routeProps.locationBeforeTransitions.pathname.split('/')[3] || "";
    return (
      <Row>
        <Spin tip="加载中..." spinning={this.props.groupInfo.path?false:true} delay={0} style={{height:'100%'}}>
          {this.props.groupInfo.path?
            <Headers />
          :null}
          {this.props.groupInfo.path?
            <Col span={18} offset={3}>
              <Row gutter={16} style={{paddingTop:15}}>
                {!who_active?
                  <Doc/>
                  :this.props.children}
              </Row>
            </Col>
          :null}

        </Spin>
        <style>
          {`
            .ant-spin-nested-loading {
                height: 100%;
            }
          `}
        </style>
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
    groupInfo:group.groupInfo,
  }
}
export default connect(mapStateToProps)(Contents)
