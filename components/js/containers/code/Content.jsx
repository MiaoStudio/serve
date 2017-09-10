
import React from 'React'
import ReactDOM from 'react-dom';
import {Row,Col,Menu,Icon,Breadcrumb, Alert,Dropdown,Message} from 'antd';
import { Router, Route, Link, hashHistory } from 'react-router';
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim';
import { fetchListAll , fetchListById , returnCurrentIdState , deleteItemAction, renameItemsAction } from '../../actions/code'
import tools from '../../utils/tools'

import FixFolderTitle from '../../components/FixFolderTitle.jsx'
import './Content.less'
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentsList:[],
      visible:false,
      clickId:"",
    };
  }
  componentDidMount(){
    console.log('did',this.props);
    const { dispatch } = this.props
    var urlId = this.props.routeProps.locationBeforeTransitions.pathname.split('/')[3] || "";
    dispatch(returnCurrentIdState(urlId))
    if(urlId){
      dispatch(fetchListById(urlId))
    }
    else{
      dispatch(fetchListAll());
    }

  }
  componentWillReceiveProps(props){
    // console.log('will receive',props);
    // if(props.currentId){
    //   const { dispatch } = this.props
    //   dispatch(fetchListById(props.currentId))
    // }
  }
  componentDidUpdate(prevProps){
    const prevFolder = prevProps.routeProps.locationBeforeTransitions.pathname.split('/')[3] ||""
    const nextFolder = this.props.routeProps.locationBeforeTransitions.pathname.split('/')[3] || ""
    if(prevFolder != nextFolder){
      const { dispatch } = this.props
      dispatch(returnCurrentIdState(nextFolder))
      if(nextFolder){
        dispatch(fetchListById(nextFolder))
      }
      else{
        dispatch(fetchListAll());
      }
    }
  }
  folderClick(id){

    const { dispatch } = this.props
    // dispatch(fetchListById(id))
    dispatch(returnCurrentIdState(id))

  }
  dropdownControl(id,type,e){
    // console.log(id);
    // console.log(type);
    // console.log(e);
    if(e.key=='delete'){
      this.deleteItem(id,type)
    }
    else if(e.key=='rename'){
      this.renameItem(id)
    }

  }
  renameItem(id){

    this.setState({clickId:id});
    this.showModal()
  }
  deleteItem(id,type){
    const { dispatch } = this.props
    dispatch(deleteItemAction(id,type))
  }
  handleOk = (e) => {
    const { dispatch } = this.props;
    dispatch(renameItemsAction(this.state.clickId,e.title))
    this.setState({
      visible: false,
    });
  }
  handleCancel = () => {
    this.setState({visible: false,});
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  render() {
    var _self = this;
    return (
      <Row className="list-wrapper">
          {this.props.contentsList.length != 0?
            this.props.contentsList.map(function(item){
            // if(item.type === 'file'){
              return (
                <div key={item._id} ref={item._id} className="file grid document"
                className={item.type === 'file'?"file grid document":"file grid folder"}>
                  {item.type === 'file'?
                  <Link className="hotspot" to={"/article/"+item._id}>
                    <img src="https://zos.alipayobjects.com/rmsportal/bNcvRbUPmHxZlozSMAwm.png"/>
                    <span className="name">{item.title}</span>
                  </Link>
                  :
                  <Link className="hotspot" to={"/mydesk/list/"+item._id} onClick={_self.folderClick.bind(_self,item._id)}>
                    <img src="https://zos.alipayobjects.com/rmsportal/YMDrBUDcjSWyZmmnDSNq.png" />
                    <span className="name">{item.title}</span>
                  </Link>
                  }

                  <div className="setting dropdown">
                    <Dropdown overlay={
                      <Menu onClick={_self.dropdownControl.bind(_self,item._id,item.type)}>
                        <Menu.Item key="rename">
                          <Icon type="edit" /> 重命名
                        </Menu.Item>
                        <Menu.Item key="moveto" disabled>
                          <Icon type="copy" /> 移动
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item key="delete" ><Icon type="delete" /> 删除</Menu.Item>
                      </Menu>
                    }
                    getPopupContainer={() => ReactDOM.findDOMNode(_self.refs[item._id])}>
                      <Icon type="setting" />
                    </Dropdown>
                  </div>
                </div>
              )

          })
          :null
          }
        <QueueAnim type={['bottom', 'bottom']}
          ease={['easeOutQuart', 'easeInOutQuart']}>
          {this.props.contentsList.length != 0?null:
            // <div className="" key='blowlion'>
              <iframe src='/views/specials/thillthelion.html' width="100%" height="80%" style={{
                position:'fixed',left:0,top:100,zIndex:0,
              }} key='blowlion11'></iframe>
            // </div>
          }
        </QueueAnim>
        {this.state.visible?
          <FixFolderTitle
          handleOk={this.handleOk}
          handleCancel ={this.handleCancel }
          />
        :null}
      </Row>

    );
  }
}


// export default Content
const mapStateToProps = state => {
  const { app ,code, routing } = state;
  // console.error(state);
  return {
    userInfo:app.userInfo,
    contentsList:code.contentsList || [],
    currentId:code.currentId,
    routeProps:routing,
    results:code.results,
  }
}


export default connect(mapStateToProps)(Content)
