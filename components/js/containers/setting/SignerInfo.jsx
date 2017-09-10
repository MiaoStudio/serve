
import React from 'React'
import {Row,Col,Menu,Icon,Card,Form,Input,Upload,Button,Select,Cascader ,message } from 'antd';
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import { returnUserInfoState } from '../../actions/app'
import Nav from '../Nav.jsx'

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
const FormItem = Form.Item;
const Option = Select.Option;
class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      avatar:this.props.userInfo.avatar
    }
  }
  componentDidMount(){
    tools.fixDocumentName('个人设置')
  }

  handleSubmit(){
    var _self = this;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.avatar = _self.state.avatar
        tools.ajax({
             url: '/api/user/update',
             method: 'POST',
             data:JSON.stringify({values:values,id:_self.props.userInfo._id}),
             headers:{'Content-Type':'application/json'},
             async: true,
             dataType:'json'
         })
        .then(function (xhr) {
           if(xhr.response.success){
             //第一步更新当前用户信息，后台也要修改sessions中的用户
             const {dispatch} = _self.props;
             dispatch(returnUserInfoState(xhr.response.userInfo));
             message.success("更新成功")
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
          message.success('上传成功，请保存')
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
    const formItemLayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 10 },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select className="icp-selector">
        <Option value="86">+86</Option>
      </Select>
    );
    const residences = [{
        value: '浙江',
        label: '浙江',
        children: [{
          value: '杭州',
          label: '杭州',
          children: [{
            value: '德力西',
            label: '德力西',
          }],
        }],
      }, {
        value: '北京',
        label: '北京',
        children: [{
          value: '朝阳区',
          label: '朝阳区',
          children: [{
            value: '招商大厦',
            label: '招商大厦',
          }],
        }],
      }, {
        value: '上海',
        label: '上海',
        children: [{
          value: '静安区',
          label: '静安区',
          children: [{
            value: '恒隆广场',
            label: '恒隆广场',
          }],
        }],
      }];
      const apartments = [{
          value: '仁聚汇通',
          label: '仁聚汇通',
          children: [{
            value: '杭州事业部',
            label: '杭州事业部',
            children: [{
              value: '技术部',
              label: '技术部',
            },{
              value: '后勤',
              label: '后勤',
            }],
          },
          {
            value: '北京总部',
            label: '北京总部',
            children: [{
              value: '技术部',
              label: '技术部',
            },{
              value: '后勤',
              label: '后勤',
            }],
          },
          {
            value: '上海部门',
            label: '上海部门',
            children: [{
              value: '技术部',
              label: '技术部',
            },{
              value: '后勤',
              label: '后勤',
            }],
          }
        ],
        }];
    var height = document.body.clientHeight -50;
    return (
      <Row>
      <Nav/>
      <Row>
      {/* <Row style={{height: height,overflowY:'auto'}}> */}
        <Col span={3}></Col>
        <Col span={18} >
          <Row gutter={16} style={{paddingTop:15}}>
            <Card>
              <h1>个人设置</h1>
              <p>一些你可以自定义的信息</p>
              <Form style={{marginTop:20}}>

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
                    {this.props.userInfo.avatar?
                      <span>
                        {this.state.avatar?
                          <img className="avatar-image" src={this.state.avatar}
                            title="查看个人信息"/>
                        :
                        <img className="avatar-image" src={this.props.userInfo.avatar}
                          title="查看个人信息"/>
                        }
                      </span>

                      :
                      <div className="avatar-text"
                      style={{background:this.props.userInfo.avatar_color}}>
                        {this.props.userInfo.name?this.props.userInfo.name.substr(0, 1).toLocaleUpperCase():""}
                      </div>
                    }

                    </Upload>

                  </span>
                  <span style={{lineHeight:'70px',paddingLeft:15,}}>上传头像</span>

                </div>
                </FormItem>
                <FormItem
                {...formItemLayout}
                  label={<span style={{    fontWeight: 700,    fontSize: 14}}>姓名</span>}
                >
                  {getFieldDecorator('name', {
                    initialValue: this.props.userInfo.name,
                    rules: [{
                      required: true, message: '姓名必填!',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                  label={<span style={{    fontWeight: 700,    fontSize: 14}}>职位</span>}
                >
                  {getFieldDecorator('job', {
                    initialValue: this.props.userInfo.job,
                    rules: [{
                      required: true, message: '职位必填!',
                    }],
                  })(
                    <Select >
                      <Option value="JAVA工程师">JAVA工程师</Option>
                      <Option value="前端工程师">前端工程师</Option>
                      <Option value="会计">会计</Option>
                      <Option value="助理">助理</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label={<span style={{    fontWeight: 700,    fontSize: 14}}>邮箱</span>}
                hasFeedback
              >
                {this.props.userInfo.email}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<span style={{    fontWeight: 700,    fontSize: 14}}>电话</span>}
              >
                {getFieldDecorator('phone', {
                  initialValue: this.props.userInfo.phone,
                  rules: [{ required: true, message: 'Please input your phone number!' }],
                })(
                  <Input addonBefore={prefixSelector} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<span style={{    fontWeight: 700,    fontSize: 14}}>所在地区</span>}
              >
                {getFieldDecorator('location', {
                  // initialValue: ['浙江', '杭州', '德力西'],
                  initialValue: this.props.userInfo.location?this.props.userInfo.location.split(","):['浙江', '杭州', '德力西'],
                  rules: [{ type: 'array', required: true, message: '所在地区必填' }],
                })(
                  <Cascader options={residences} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<span style={{    fontWeight: 700,    fontSize: 14}}>所在部门</span>}
              >
                {getFieldDecorator('apartment', {
                  // initialValue: ['仁聚汇通', '杭州事业部', '技术部'],
                  initialValue: this.props.userInfo.apartment?this.props.userInfo.apartment.split(","):['仁聚汇通', '杭州事业部', '技术部'],
                  rules: [{ type: 'array', required: true, message: '所在部门必填' }],
                })(
                  <Cascader options={apartments} />
                )}
              </FormItem>
                <FormItem>
                  <Button style={{width:100}} type="primary"  size="large" onClick={this.handleSubmit.bind(this)}>更新</Button>
                </FormItem>
              </Form>
            </Card>
          </Row>


        </Col>
      </Row>
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
