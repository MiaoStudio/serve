
import React from 'React'
import {Row,Col,Menu,Icon,Card,Form,Input,Upload,Button} from 'antd';
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import { returnUserInfoState } from '../../actions/app'
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
const FormItem = Form.Item;


class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      avatar:'https://zos.alipayobjects.com/rmsportal/RxrEnxYenqNXvIU.png'
    }
  }
  componentDidMount(){
    tools.fixDocumentName('新建团队')
  }
  validatePath(rule, value, callback){
    if(value){
      if(!/^[a-z][a-z0-9_]{1,}$/.test(value)){
        callback('只能输入小写字母、横线、下划线和点，至少 2 个字符')
      }
      else if(value.toLowerCase() == 'new'){
        callback('路径 new 为保留路径，请更换')
      }
      else{
        tools.ajax({
             url: '/api/group/pathCheck',
             method: 'POST',
             data:JSON.stringify({path:value}),
             headers:{'Content-Type':'application/json'},
             async: true,
             dataType:'json'
         })
        .then(function (xhr) {
           console.log(xhr.response.success);
           if(xhr.response.success){
             callback()
           }
           else{
             callback('路径被别人抢先了，换个新的试试')
           }
        },
        function (e) {
          console.log(JSON.stringify(e))
        })
      }
    }
    else{
      callback()

    }
  }
  handleSubmit(){
    var _self = this;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.avatar = _self.state.avatar
        tools.ajax({
             url: '/api/group/new',
             method: 'POST',
             data:JSON.stringify({values:values}),
             headers:{'Content-Type':'application/json'},
             async: true,
             dataType:'json'
         })
        .then(function (xhr) {
           console.log(xhr.response.success);
           if(xhr.response.success){
             //第一步更新当前用户信息，后台也要修改sessions中的用户
             const {dispatch} = _self.props;
             console.log(xhr.response.userInfo);
             dispatch(returnUserInfoState(xhr.response.userInfo))
             //第二部跳转到新建的group
             browserHistory.push('/group/'+xhr.response.teamer.path)

           }

        },
        function (e) {
          console.log(JSON.stringify(e))
        })
      }
    });
  }
  render() {
    var _self = this;
    let uploadProps = {
      name: 'avatar_file',
      action: '/api/avatar',
      // data:{abc:123},//不知道啥原因，这样提交参数，后台没法解析到！！可能是插件问题
      showUploadList:false,
      onChange(info) {
        if (info.file.status === 'done') {
          _self.setState({
            avatar:info.file.response.avatar
          })
          // const {dispatch} = self.props
          // dispatch(updateUserInfo());
          // dispatch(updateAllMessages(info.file.response.userInfo))
        }
      },
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <Row>
      {/* <Row style={{height: '100%',overflowY:'auto'}}> */}
        <Col span={3}></Col>
        <Col span={18} >
          <Row gutter={16} style={{paddingTop:15}}>
            <Card>
              <h1>新建团队</h1>
              <p>团队可以是一群人、一个部门、一个项目、一个产品</p>
              <Form style={{marginTop:20}}>
                <FormItem
                  label={<span style={{    fontWeight: 700,    fontSize: 14}}>名称</span>}
                  labelCol={{span:24}}
                  wrapperCol={{span:12}}
                  // hasFeedback
                >
                  {getFieldDecorator('teamName', {
                    rules: [{
                      required: true, message: '请输入团队名称',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                  // label="名称"
                  // labelCol={{span:24}}
                  wrapperCol={{span:12}}
                  // hasFeedback
                  extra={'这将用来生成团队的访问路径，尽量短、语义化，方便记住与分享'}
                >
                  {getFieldDecorator('path', {
                    validateTrigger: 'onBlur',
                    rules: [{
                      required: true, message: '访问路径不能为空',
                    },
                    {validator: this.validatePath.bind(this)},
                    ],
                  }

                  )(
                    <Input addonBefore={window.location.origin+'/group/'} />
                  )}
                </FormItem>
                <FormItem
                  label={<span style={{    fontWeight: 700,    fontSize: 14}}>简介</span>}
                  labelCol={{span:24}}
                  wrapperCol={{span:16}}
                  hasFeedback
                >
                  {getFieldDecorator('intro', {
                    rules: [{
                      // required: true, message: '请输入团队名称',
                    }],
                  })(
                    <Input  type="textarea" rows="3"/>
                  )}
                </FormItem>
                <FormItem
                  label={<span style={{    fontWeight: 700,    fontSize: 14}}>头像</span>}
                  labelCol={{span:24}}
                  wrapperCol={{span:16}}
                  hasFeedback
                >
                <div>
                  <span style={{display:'inline-block',float:'left'}}>
                    <Upload {...uploadProps}
                      style={{display:'inline-block'}}>
                      <img className="avatar-image" src={this.state.avatar}
                        title="查看个人信息"/>
                      </Upload>

                  </span>
                  <span style={{lineHeight:'70px',paddingLeft:15,}}>上传团队头像</span>

                </div>
                </FormItem>
                <FormItem>
                  <Button style={{width:100}} type="primary"  size="large" onClick={this.handleSubmit.bind(this)}>新建</Button>
                </FormItem>
              </Form>
            </Card>
          </Row>


        </Col>
      </Row>

    );
  }
}

const mapStateToProps = state => {
  const { app } = state
  return {
    userInfo:app.userInfo,
    app:app
  }
}


export default connect(mapStateToProps)(Form.create()(Contents))
