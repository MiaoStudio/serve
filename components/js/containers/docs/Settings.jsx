
import React from 'React'
import {Row,Col,Badge,Icon,Button,Card} from 'antd'
import { connect } from 'react-redux';
import { Router, Route, Link, hashHistory } from 'react-router';
import Side from './Settings_Side.jsx'
import Basic from './Settings_basic.jsx'

class Contents extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){

  }
  render() {
    var isActive = this.props.children?true:false
    return (
      <Row gutter={16}>
        <Col xs={{ span: 24}} sm={{ span: 8}} md={{ span: 7}}>
          <Card title="设置"  className="noPadding" >
            <Side path={this.props.params.path} isActive={isActive}/>
          </Card>
        </Col>
        <Col xs={{ span: 24}} sm={{ span: 16}} md={{ span: 17}} >

            {this.props.children?this.props.children:<Basic/>}
        </Col>

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
