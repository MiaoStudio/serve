
import React from 'React'
import {Row,Col,Menu,Icon} from 'antd';
import { connect } from 'react-redux'
import { Router, Route, Link, hashHistory } from 'react-router';
import tools from '../../utils/tools'
import './C_Menu.less'

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '1',
      openKeys: [],
    };
  }
  handleClick = (e) => {
    console.log('Clicked: ', e);
    this.setState({ current: e.key });

  }
  onOpenChange = (openKeys) => {
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({ openKeys: nextOpenKeys });
  }
  getAncestorKeys = (key) => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  }
  render() {
    // console.log(this.props.userInfo);
    return (
      <Row className="c_menu">
        <Menu
          mode="inline"
          openKeys={this.state.openKeys}
          selectedKeys={[this.state.current]}
          onOpenChange={this.onOpenChange}
          onClick={this.handleClick}
        >
          <Menu.Item key="1"><Link to={"/main/list"}><Icon type="home" />我的文档</Link></Menu.Item>
          <Menu.Item key="2"><Icon type="home" />我的文档</Menu.Item>

        </Menu>
      </Row>

    );
  }
}


// export default Content
const mapStateToProps = state => {
  const { app } = state
  return {
    userInfo:app.userInfo,
  }
}


export default connect(mapStateToProps)(Content)
