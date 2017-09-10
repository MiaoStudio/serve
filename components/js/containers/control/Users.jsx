
import React from 'React'
import {Row,Col,Menu,Icon,Table,Button} from 'antd';
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import Nav from '../Nav.jsx'
import { fetchAllItems , deleteItem , updateItem , addItem , returnVisible } from '../../actions/control'
import NewUserModal from '../../components/NewUserModal.jsx'

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem:{},
    };
    const { dispatch } = this.props
    dispatch(fetchAllItems('users'))
  }
  showModal = (type,data) => {
    const { dispatch } = this.props
    dispatch(returnVisible(true))
    this.setState({
      // visible: true,
      selectedItem:data
    });
  }
  handleCancel = () => {
    // this.setState({visible: false,});
    const { dispatch } = this.props
    dispatch(returnVisible(false))
  }
  handleOk = (e) => {
    console.log(e);
    const { dispatch } = this.props
    if(e._id){
      dispatch(updateItem(e,'user'))
    }
    else{
      dispatch(addItem(e,'user'))
    }

    // this.setState({
    //   visible: false,
    // });
  }
  deleteItem(_id){
    const { dispatch } = this.props
    dispatch(deleteItem(_id,'user'))
  }
  render() {
    console.log(this.props.visible);
    const columns = [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        // render: text => {text},
      }, {
        title: '职位',
        dataIndex: 'job',
        key: 'job',
      }, {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },{
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },{
        title: '权限',
        dataIndex: 'role',
        key: 'role',
      },{
        title: '所在地区',
        dataIndex: 'location',
        key: 'location',
      },{
        title: '所属部门',
        dataIndex: 'apartment',
        key: 'apartment',
      },  {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={this.deleteItem.bind(this,record._id)}>删除</a>
            <span className="ant-divider" />
            <a href="javascript:;"  onClick={this.showModal.bind(this,'edit',record)}>编辑</a>
          </span>
        ),
      }];
    return (
      <Row>
        <Table
          columns={columns}
          dataSource={this.props.users}
          rowKey={record => record._id}
          // bordered
          title={() => <Button type="primary" onClick={this.showModal.bind(this,'add','{}')}>新增用户</Button>}
         />
         {this.props.visible?
           <NewUserModal
           handleOk={this.handleOk}
           handleCancel ={this.handleCancel }
           selectedItem={this.state.selectedItem}
           />
         :null}

      </Row>

    );
  }
}


const mapStateToProps = state => {
  const { control } = state
  return {
    users:control.users,
    visible:control.visible,
  }
}


export default connect(mapStateToProps)(Users)
