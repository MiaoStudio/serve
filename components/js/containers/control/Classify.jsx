
import React from 'React'
import {Row,Col,Menu,Icon,Table,Button,Card,Tooltip,Dropdown ,Tabs } from 'antd';
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import Nav from '../Nav.jsx'
import { fetchAllItems , deleteItem , updateItem , addItem , returnVisible } from '../../actions/control'
import NewClassifyModal from '../../components/NewClassifyModal.jsx';
import AddArticleToClassify from '../../components/AddArticleToClassify.jsx';
import AddDocToClassify from '../../components/AddDocToClassify.jsx';
import AddGroupToClassify from '../../components/AddGroupToClassify.jsx';

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
const TabPane = Tabs.TabPane;

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem:{},
    };
    const { dispatch } = this.props
    dispatch(fetchAllItems('class'))
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
      dispatch(updateItem(e,'class'))
    }
    else{
      dispatch(addItem(e,'class'))
    }
  }
  deleteItem(_id){
    const { dispatch } = this.props
    dispatch(deleteItem(_id,'class'))
  }
  render() {
    console.log(this.props.visible);
    var _self = this;
    return (
      <Row>
        <Button type="primary" onClick={this.showModal.bind(this,'add','{}')}>新增分类</Button>

          {this.props.classifies.map(function(item,index){
            return (
                <Card title={
                  <p>
                    <Tooltip title={item.intro}>
                      {item.name}
                    </Tooltip>
                    <span style={{color:'grey'}}>{item.en_name?<span> ({item.en_name})</span>:""}</span>
                  </p>
                  }
                  style={{marginBottom:15}}
                  key={index}
                  className="noPadding "
                  extra={
                    <Dropdown overlay={
                      <Menu>
                        <Menu.Item>
                          <a href="javascript:;" onClick={_self.showModal.bind(_self,'edit',item)}>编辑</a>
                        </Menu.Item>
                        <Menu.Item>
                          <a href="javascript:;" onClick={_self.deleteItem.bind(_self,item._id)}>删除</a>
                        </Menu.Item>
                      </Menu>
                    }>
                      <a href="javascript:;">More</a>
                    </Dropdown>
                  }
                  bordered={true}>
                  <Tabs
                   defaultActiveKey="1"
                   tabPosition={'left'}
                   style={{ minHeight: 220 }}
                  >
                   <TabPane tab="文章" key="1">
                     <AddArticleToClassify data={item}
                     dispatch={_self.props.dispatch}/>
                   </TabPane>
                   <TabPane tab="文档" key="2">
                     <AddDocToClassify data={item}
                     dispatch={_self.props.dispatch}/>
                   </TabPane>
                   <TabPane tab="团队" key="3">
                     <AddGroupToClassify data={item}
                     dispatch={_self.props.dispatch}/>
                   </TabPane>
                  </Tabs>
                </Card>
            )
          })}

         {this.props.visible?
           <NewClassifyModal
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
    classifies:control.classifies,
    visible:control.visible,
  }
}


export default connect(mapStateToProps)(Groups)
