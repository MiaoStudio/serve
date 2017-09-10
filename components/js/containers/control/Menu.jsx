
import React from 'React'
import {Row,Col,Menu,Icon} from 'antd';
import { connect } from 'react-redux'
import { Router, Route, Link, hashHistory } from 'react-router';
import tools from '../../utils/tools'

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
  render() {
    // console.log(this.props.userInfo);
    return (
      <Row className="c_menu">
        <Menu
          mode="inline"
          openKeys={this.state.openKeys}
          selectedKeys={[this.state.current]}
          onClick={this.handleClick}
        >
          <Menu.Item key="1"><Link to={"/admin/users"} ><Icon type="usergroup-add" />用户</Link></Menu.Item>
          <Menu.Item key="3">
            <Link to={"/admin/classify"} >
            <Icon type="appstore-o" />分类</Link>
          </Menu.Item>
          <Menu.Item key="2"><Icon type="file-add" />文档</Menu.Item>

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
