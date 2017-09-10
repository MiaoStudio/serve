import React from 'React'
import {Row,Col,Menu,Icon,Breadcrumb, Alert,Dropdown,Button,Modal} from 'antd';
import { Router, Route, Link, hashHistory } from 'react-router';
import { creatItems } from '../../actions/code'
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import './C_Header.less'
import FixFolderTitle from '../../components/FixFolderTitle.jsx'
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    let parents = [];
    console.log(this.props);
    if(this.props.results.parents){
      this.props.results.parents.map(function(item){
        if(item){
          parents.push(item._id)
        }
      })
    }

    parents.push(this.props.currentId||null)
    let obj = {type:'folder',userInfo:this.props.userInfo,
    title:e.title,parent:this.props.currentId||null,parents:parents};
    const { dispatch } = this.props
    dispatch(creatItems(obj))
    this.setState({
      visible: false,
    });
  }
  handleCancel = () => {
    this.setState({visible: false,});
  }
  handleClick = (e) => {
     console.log('click ', e);
     if(e.key == 'file'){
       let obj = {type:'file',userInfo:this.props.userInfo,
       parent:this.props.currentId||null};
       const { dispatch } = this.props
       dispatch(creatItems(obj))
     }
     else if(e.key == 'folder'){
       console.log(this.props);
     }
  }

  render() {
    const menu = (
      <Menu onClick={this.handleClick}>
        <Menu.Item key="file">
          <a href="javascript:;"><Icon type="file-text" /> 文 档</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="folder">
          <a href="javascript:;" onClick={this.showModal}><Icon type="folder" /> 文件夹</a>
        </Menu.Item>
      </Menu>
    );
    let breadcrumbData = this.props.results.parents || []
    return (
      <Row className="code_nav">
        <Col span={18} offset={3} style={{height:'100%'}} >
          <div className="main-content">
          <Breadcrumb separator=">" style={{
            // lineHeight:'50px',
            display:"inline-block"
          }}>
            <Breadcrumb.Item><Link to={"/doc/list"}>我的文档</Link></Breadcrumb.Item>
            {breadcrumbData.length>3?
              <Breadcrumb.Item href="javascript:;" >
              <Dropdown overlay={
                  <Menu>
                    {breadcrumbData.map(function(item,index){
                      if(item){
                        return  <Menu.Item key={index}>
                                  <Link to={"/doc/list/"+item._id}>
                                  <img style={{
                                    width:15,
                                    verticalAlign:'text-top',
                                    margin:'0 5px 0 0'
                                  }} src="https://zos.alipayobjects.com/rmsportal/YMDrBUDcjSWyZmmnDSNq.png"/>

                                  <span>{item.title}</span>
                                  </Link>
                                </Menu.Item>
                      }
                    })}
                  </Menu>
                  }>
                  <a className="ant-dropdown-link" href="#">
                    <Icon type="ellipsis"  />
                  </a>
                </Dropdown>
              </Breadcrumb.Item>
              :
              breadcrumbData.map(function(item,index){
                if(item){
                  return <Breadcrumb.Item href="javascript:;" key={index}>

                    <Link to={"/doc/list/"+item._id}>{item.title}</Link>
                  </Breadcrumb.Item>
                }
              })
            }

            <Breadcrumb.Item href="javascript:;">{this.props.results.title}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{float:'right'}}>
            <Dropdown overlay={menu} trigger={['click']} >
            <Button style={{
              background: '#4a4a4a',
              width: '130px',
              color:'#fff'
            }}>
              新建

            </Button>
            </Dropdown>

          </div>
          </div>

        </Col>
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
  const { app ,code } = state
  return {
    userInfo:app.userInfo,
    contentsList:code.contentsList || [],
    currentId:code.currentId,
    results:code.results,
  }
}


export default connect(mapStateToProps)(Content)
