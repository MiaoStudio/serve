
import React from 'React'
import {Row,Col,Menu,Icon} from 'antd';
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import Nav from '../Nav.jsx'
import { fetchAllUsers } from '../../actions/control'

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
class Users extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props
    dispatch(fetchAllUsers())
  }

  render() {
    console.log(this.props.users);
    return (
      <Row>
      asdasadas
      </Row>

    );
  }
}


const mapStateToProps = state => {
  const { control } = state
  return {
    users:control.users,
  }
}


export default connect(mapStateToProps)(Users)
