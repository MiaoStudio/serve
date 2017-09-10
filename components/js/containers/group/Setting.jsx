
import React from 'React'
import {Row,Col,Badge,Card,Button,Form,Input,Upload,message} from 'antd'
import { Router, Route, Link, hashHistory } from 'react-router';
import { updateGroupInfo , returnGroupInfoState , returndeleteModalVisible , deleteGroup } from '../../actions/group'
import tools from '../../utils/tools'
import { connect } from 'react-redux';
import DeleteGroupModal from '../../components/DeleteGroupModal.jsx'

const FormItem = Form.Item;
class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      avatar:this.props.groupInfo.avatar,
      path:this.props.groupInfo.path
    }
  }
  validatePath(rule, value, callback){
    console.log(value);
    if(!/^[a-z][a-z0-9_]{1,}$/.test(value)){
      callback('只能输入小写字母、横线、下划线和点，至少 2 个字符')
    }
    else if(value.toLowerCase() == 'new'){
      callback('路径 new 为保留路径，请更换')
    }
    else if(value.toLowerCase() == this.state.path){
      callback()
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
  handleSubmit(){
    var _self = this;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.avatar = _self.state.avatar
        values._id = _self.props.groupInfo._id
        const { dispatch } = _self.props
        dispatch(updateGroupInfo(values))
      }
    });
  }
  deleteGroup(){
    const { dispatch } = this.props
    dispatch(returndeleteModalVisible(true))
  }
  handleOk(){
    console.log('确定删除');
    const { dispatch } = this.props
    dispatch(deleteGroup(this.props.groupInfo._id))

  }
  handleCancel(){
    const { dispatch } = this.props
    dispatch(returndeleteModalVisible(false))
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    var _self = this;
    let uploadProps = {
      name: 'avatar_file',
      action: '/api/avatar',
      // data:{abc:123},//不知道啥原因，这样提交参数，后台没法解析到！！可能是插件问题
      showUploadList:false,
      beforeUpload(file) {

        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          message.error('头像大小不能超过 1MB!');
        }
        return isLt1M;
      },
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
    return (
      <Row>
        <Card title="团队设置" >
          <p className="setting-form-desc"><span>团队可以是一个产品团队、一个部门、一个人或一群人</span></p>

          <Form >
            <FormItem
              label={<span style={{    fontWeight: 700,    fontSize: 14}}>名称</span>}
              labelCol={{span:24}}
              wrapperCol={{span:12}}
              // hasFeedback
            >
              {getFieldDecorator('teamName', {
                initialValue:this.props.groupInfo.teamName,
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
                initialValue:this.props.groupInfo.path,
                validateTrigger: 'onBlur',
                rules: [{
                  required: true, message: '访问路径不能为空',
                },
                {validator: this.validatePath.bind(this)},
                ],
              }

              )(
                <Input addonBefore="http://等我想个好的域名/" />
              )}
            </FormItem>
            <FormItem
              label={<span style={{    fontWeight: 700,    fontSize: 14}}>简介</span>}
              labelCol={{span:24}}
              wrapperCol={{span:16}}
              hasFeedback
            >
              {getFieldDecorator('intro', {

                initialValue:this.props.groupInfo.intro,
                rules: [{
                  // required: true, message: '请输入团队名称',
                }],
              })(
                <Input  type="textarea" rows="3"/>
              )}
            </FormItem>
            <FormItem
              label={<span style={{    fontWeight: 700,    fontSize: 14}}>简介</span>}
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
              <Button style={{width:100}} type="primary"  size="large"
                onClick={this.handleSubmit.bind(this)}>更新</Button>
            </FormItem>
            {this.props.userInfo._id == this.props.groupInfo.teamOwner._id?
              <FormItem>
                <Button style={{width:100}} type="danger"  size="large"
                  onClick={this.deleteGroup.bind(this)}>删除</Button>
              </FormItem>
            :null}

          </Form>
        </Card>
        {this.props.visible?
          <DeleteGroupModal
          handleOk={this.handleOk.bind(this)}
          handleCancel ={this.handleCancel.bind(this) }
          data={this.props.groupInfo}
          />
        :null}
      </Row>
    );
  }
}


// export default Contents
const mapStateToProps = state => {
  const { app , routing , group} = state
  return {
    userInfo:app.userInfo,
    routeProps:routing,
    visible:group.deleteModalVisible,
    groupInfo:group.groupInfo
  }
}
export default connect(mapStateToProps)(Form.create()(Contents))
