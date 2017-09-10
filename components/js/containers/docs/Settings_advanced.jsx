
import React from 'React'
import {Row,Col,Badge,Icon,Button,Card,Checkbox ,Form,Select,Input,message} from 'antd'
import { connect } from 'react-redux';
import { Router, Route, Link, hashHistory } from 'react-router';
import { updateDocInfo , deleteDoc } from '../../actions/docs'
import Side from './Settings_Side.jsx'
import DeleteGroupModal from '../../components/DeleteGroupModal.jsx'
import { returndeleteModalVisible  } from '../../actions/group'
const FormItem = Form.Item;
const Option = Select.Option;
class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      parentId:"",
    }
  }
  componentDidMount(){

  }
  deleteDoc(){
    const { dispatch } = this.props
    dispatch(returndeleteModalVisible(true))
  }
  handleOk(){
    console.log('确定删除');
    const { dispatch } = this.props
    dispatch(deleteDoc(this.props.docInfo._id))
  }
  handleCancel(){
    const { dispatch } = this.props
    dispatch(returndeleteModalVisible(false))
  }
  changeParent(){
    if(this.state.parentId === this.props.docInfo.parentArray._id){
      message.info("已经属于当前父级")
    }
    else{
      var values = {};
      values.id = this.props.docInfo._id
      values.path = this.props.docInfo.path;
      values.parent = this.state.parentId;
      const { dispatch } = this.props;
      dispatch(updateDocInfo(values));
    }
  }
  setParent(e){
      this.setState({parentId:e})
  }
  changeShareStatus(){
    var values = {};
    values.share = this.props.docInfo.share == 'true'?"false":"true"
    values.id = this.props.docInfo._id
    values.path = this.props.docInfo.path
    const { dispatch } = this.props;
    dispatch(updateDocInfo(values));
  }
  catalogControl(e){
    var values = {};
    values.show_menu = e.target.checked.toString()
    values.id = this.props.docInfo._id
    values.path = this.props.docInfo.path
    const { dispatch } = this.props;
    dispatch(updateDocInfo(values));
  }
  render() {
    var lockInfo = this.props.docInfo.share == 'true'?"私密":"公开";
    var parentArray = this.props.docInfo.parentArray ||{}
    var optionArray = [];
    optionArray.push(
      <Option value={this.props.userInfo._id} key={this.props.userInfo._id}>
        {this.props.userInfo.avatar?
          <img className="avatar-image" src={this.props.userInfo.avatar}
            key='img'
            style={{height:20,width:20,margin:'5px 0',display:'inline-block',float:'left'}}
            title="查看个人信息"/>
          :
          <div className="avatar-text"
            key='text'
          style={{height:20,width:20,margin:'5px 0',float:'left',background:this.props.userInfo.avatar_color}}
          >
            {this.props.userInfo.name?this.props.userInfo.name.substr(0, 1).toLocaleUpperCase():""}
          </div>
        }
        <span className="selectOptionsTitle" >
          {this.props.userInfo.name}({this.props.userInfo.email})
        </span>
      </Option>
    )
    var teamBelong = this.props.userInfo.teamBelong||[];
    teamBelong.map(function(item,index){
      optionArray.push(
        <Option value={item._id} key={item._id}>
          <img className="avatar-image" src={item.avatar} style={{height:20,width:20,margin:'5px 0',display:'inline-block',float:'left'}}
            title="查看个人信息"/>
          <span className="selectOptionsTitle">
            {item.teamName}({item.path})
          </span>
        </Option>
      )
    });
    return (
      <div>
        <Card title="附加功能"
          className="">
          <Checkbox onChange={this.catalogControl.bind(this)}
            defaultChecked={this.props.docInfo.show_menu =='true'?true:false}>开启目录功能</Checkbox>
          <p style={{paddingTop: 8}}>
            启用此项，将开启目录功能，你需要用 Markdown 格式
            {this.props.docInfo.show_menu =='true'?<Link> 编写自定义的目录</Link>:" 编写自定义的目录"}

          </p>
        </Card>
        <Card title="仓库转移"
          style={{marginTop:16}}
          className="">
          <p style={{marginBottom:16}}>
            转移权限只有团队 Owner 拥有
          </p>
          <FormItem>
          <Row>
            <Col xs={24} sm={14} md={14}>
              <Col span={11}>
                <FormItem>
                  <Select dropdownMatchSelectWidth={false}
                    onChange={this.setParent.bind(this)}
                    placeholder={'请选择'}
                    style={{    width:'100%'}}>
                    {optionArray}
                  </Select>
                </FormItem>
              </Col>
              <Col span={2}><p className="ant-form-split">/</p></Col>
              <Col span={11}>
                <FormItem>
                  <Input disabled value={this.props.docInfo.path }/>
                </FormItem>
              </Col>
            </Col>

          </Row>
        </FormItem>
        <Button style={{width:100}} type="danger"  size="large" ghost
          onClick={this.changeParent.bind(this)}>转 移</Button>
        </Card>
        <Card title={"设置文档为"+lockInfo}
          style={{marginTop:16}}
          className="">
          <p style={{marginBottom:16}}>
            该仓库目前为公开仓库，切换成私密仓库后仅自己可见。注意！切换成私密状态，仓库会丢失所有的“喜欢”与稻谷数，请谨慎操作！
          </p>
          <Button style={{width:100}} type="danger"  size="large" ghost
            onClick={this.changeShareStatus.bind(this)}>设置为{lockInfo}</Button>
        </Card>
        <Card title="删除仓库"
          style={{marginTop:16}}
          className="">
            <p style={{marginBottom:16}}>删除权限只有团队 Owner 拥有，注意这是不可逆操作</p>

          <Button style={{width:100}} type="danger"  size="large"
            onClick={this.deleteDoc.bind(this)}>删除</Button>
        </Card>
        {this.props.visible?
          <DeleteGroupModal
          handleOk={this.handleOk.bind(this)}
          handleCancel ={this.handleCancel.bind(this) }
          data={this.props.docInfo}
          />
        :null}
      </div>

    );
  }
}


// export default Contents
const mapStateToProps = state => {
  const { app , routing , group,docs} = state
  return {
    userInfo:app.userInfo,
    routeProps:routing,
    docInfo:docs.docInfo,
    visible:group.deleteModalVisible,
  }
}
export default connect(mapStateToProps)(Contents)
