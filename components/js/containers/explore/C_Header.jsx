import React from 'React'
import {Row,Col,Menu,Icon,Breadcrumb, Alert,Dropdown,Button,Modal} from 'antd';
import { Router, Route, Link, hashHistory } from 'react-router';
import { creatItems } from '../../actions/code'
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import './C_Header.less'
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  render() {

    return (
      <Row className="code_nav">
        <Col span={18} offset={3} style={{height:'100%'}} >
          <div className="main-content">
	          <div className="header_right">
	          	<Menu
	              defaultSelectedKeys={['code']}
	              mode="horizontal"
	              onClick={this.handleClick}
	            >
	              <Menu.Item key="popular">

	                <Link to="/explore/popular">最新最热</Link>
	              </Menu.Item>
	              <Menu.Item key="jingpin">
	                <Link to="/explore/classify">精品栏目</Link>
	              </Menu.Item>

	            </Menu>
	          </div>


          </div>

        </Col>
      </Row>

    );
  }
}


// export default Content
const mapStateToProps = state => {
  const { app ,code } = state
  return {
    userInfo:app.userInfo,
    contentsList:code.contentsList || [],
    currentId:code.currentId,
    results:code.results,
  }
}


export default connect(mapStateToProps)(Content)
