
import React from 'React'
import {Row,Col,Menu,Icon} from 'antd';
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import Nav from '../Nav.jsx'
import Menus from './Menu.jsx'
import { updateUserInfo } from '../../actions/app'
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
class Index extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props
    dispatch(updateUserInfo())
  }

  render() {
    return (
      <Row>
      <Nav/>
      <Row>
        <Col span={3}></Col>
        <Col span={18} >
          <Col span={3}>
            <Menus/>
          </Col>
          <Col span={20}>
            {this.props.children?this.props.children:'asdas'}
          </Col>

        </Col>
      </Row>
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
