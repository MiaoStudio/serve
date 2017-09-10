
import React from 'React';
import {Row,Col,Menu,Icon,Button} from 'antd';
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import C_Header from './C_Header.jsx'
import Nav from '../Nav.jsx'
import './index.less'
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var ename = this.props.params.ename
    return (
      <Row style={{height: '100%'}}>
          <Nav/>
          {ename?null:<C_Header/>}
          {ename?this.props.children:
            <Row style={{paddingTop:15}}>
                <Col span={18} offset={3}>
                  {this.props.children}
                </Col>
            </Row>
          }



      </Row>

    );
  }
}


// export default Index
const mapStateToProps = state => {
  const { app } = state
  return {
    userInfo:app.userInfo,
    app:app
  }
}


export default connect(mapStateToProps)(Index)
