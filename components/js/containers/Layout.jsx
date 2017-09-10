
import React from 'React'
import {Row,Col} from 'antd'
import '../../style/app.less';
import Nav from './Nav.jsx'
import { connect } from 'react-redux'
// import { updateUserInfo } from '../actions/app'

class Layout extends React.Component {
  constructor(props) {
    super(props);
    // const { dispatch } = this.props
    // dispatch(updateUserInfo())
  }
  render() {
    return (
      <Row style={{height:'100%'}}>
        {/* <div className="background"><div></div></div> */}
        <Nav/>
        {/* <Col span={18} offset={3} style={{height:'100%'}} > */}

          {this.props.children}
        {/* </Col> */}
      </Row>
    );
  }
}


// export default Layout
const mapStateToProps = state => {
  const { app } = state
  return {

  }
}
export default connect(mapStateToProps)(Layout)
