
import React from 'React'
import {Row,Col,Tabs,Badge,Spin} from 'antd'
import { connect } from 'react-redux';
import Headers from './Head.jsx'
import { getDocInfo ,returnDocInfoState } from '../../actions/docs'
import './doc.less'
import Catalog from './Catalog.jsx'
import List from './List.jsx'
const TabPane = Tabs.TabPane;

class Contents extends React.Component {
  constructor(props) {
    super(props);
    var path = this.props.routeParams.path
    const { dispatch } = this.props
    dispatch(getDocInfo(path))
  }
  componentWillUnmount() {
    console.log('卸载');
    const { dispatch } = this.props;
    dispatch(returnDocInfoState([]));

  }
  render() {
    var who_active = this.props.routeProps.locationBeforeTransitions.pathname.split('/')[3] || "";
    var height = document.body.clientHeight -50;
    var isShowMenu = this.props.docInfo.show_menu === 'true'


    return (
      this.props.params.id?this.props.children:
      <Row>
      {/* <Row style={{height: height,overflowY:'auto'}}> */}
          <Spin tip="加载中..." spinning={this.props.docInfo.path?false:true} delay={0} style={{height:'100%'}}>
            {this.props.docInfo.path?
              <Headers path={this.props.routeParams.path} />
            :null}
            {this.props.docInfo.path?
              <Col span={18} offset={3}>
                <Row gutter={16} style={{paddingTop:15}}>
                  {!who_active?
                    isShowMenu?<Catalog/>:<List params={this.props.params}/>
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
  const { app , routing , group,docs} = state
  return {
    userInfo:app.userInfo,
    routeProps:routing,
    docInfo:docs.docInfo,
  }
}
export default connect(mapStateToProps)(Contents)
