
import React from 'React'
import {Row,Col,Menu,Icon} from 'antd';
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import C_Header from './C_Header.jsx'
import C_Menu from './C_Menu.jsx'
import Content from './Content.jsx'

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Row>
        <C_Header/>
        <Col span={18} offset={3} style={{height:'100%',paddingTop:15}} >
          {/* <Col span={3}>
            <C_Menu/>
          </Col>
          <Col span={21} > */}
            <Content/>
          {/* </Col> */}

        </Col>
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
