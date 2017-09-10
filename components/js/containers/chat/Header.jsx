
import React from 'React'
import { Modal ,Button,Upload,Form, Select, Input,DatePicker,Spin } from 'antd';
import tools from '../../utils/tools'
import acientBirth from '../../utils/acientBirth'
import moment from 'moment'
import { connect } from 'react-redux'
import { updateAllMessages,updateUserInfo } from '../../actions/app'

const FormItem = Form.Item;
const Option = Select.Option;

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      edible:false,
      spinning:false,
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
      edible:false,
    });
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  logout(){
    tools.ajax({
         url: '/logout',
         method: 'GET',
         headers:{'Content-Type':'application/json'},
         async: true,
         dataType:'json'
     })
    .then(function (xhr) {
       window.location.href = '/signin'

    },
    function (e) {
      console.log(JSON.stringify(e))
    })
  }
  componentDidMount(){
    var _self = this;
  }
  componentWillReceiveProps(next){
    if(next.userInfo.avatar){
      this.setState({avatar_url:next.userInfo.avatar})
    }else{
      this.setState({avatar_name:next.userInfo.name,avatar_color:next.userInfo.avatar_color})
    }
  }
  enEdible(){
    this.setState({edible:true})
  }
  handleSubmit(){
    var _self = this;
    let val = this.props.form.getFieldsValue();
    _self.setState({spinning:true})
    // let test = {};
    // test.y = parseInt(moment(val.birth).format('YYYY'))
    // test.m = parseInt(moment(val.birth).format('MM'))
    // test.d = parseInt(moment(val.birth).format('DD'))
    // test.h = parseInt(moment(val.birth).format('hh'))
    //
    // console.log(test);
    // console.log(acientBirth.inq(test));

    val.birth = moment(val.birth).format('YYYY-MM-DD HH:mm')
    console.log(val);
    tools.ajax({
         url: '/api/user/update?id='+this.props.userInfo._id,
         method: 'POST',
         data:JSON.stringify({val:val}),
         headers:{'Content-Type':'application/json'},
         async: true,
         dataType:'json'
     })
    .then(function (xhr) {
       console.log(xhr.response.userInfo);
       const {dispatch} = _self.props
       dispatch(updateUserInfo());
       dispatch(updateAllMessages(xhr.response.userInfo))
       _self.setState({edible:false,spinning:false})
    },
    function (e) {
      console.log(JSON.stringify(e))
      _self.setState({spinning:false})
    })
  }
  render() {
    var self = this;
    let uploadProps = {
      name: 'avatar_file',
      action: '/api/user/avatar?id='+this.props.userInfo._id,
      // data:{abc:123},//不知道啥原因，这样提交参数，后台没法解析到！！可能是插件问题
      showUploadList:false,
      onChange(info) {
        // console.log(info);
        self.setState({spinning:true})
        if (info.file.status === 'done') {
          self.setState({spinning:false})
          const {dispatch} = self.props
          dispatch(updateUserInfo());
          dispatch(updateAllMessages(info.file.response.userInfo))
        }
      },
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="header">

        <div className="logo">
          <img src="https://zos.alipayobjects.com/rmsportal/TCkBobatQtykvRDJWGiR.png"/>
        </div>
        <nav className="nav-list"></nav>
        <div className="user-panel">
          <a href="javascript:;" onClick={this.showModal}>
            {this.state.avatar_url?
              <img className="avatar-image" src={'/upload/avatar/'+this.state.avatar_url}
              title="查看个人信息"/>
              :
              <div className="avatar-text"
              style={{background:this.state.avatar_color}}>
                {this.state.avatar_name?this.state.avatar_name.substr(0, 1).toLocaleUpperCase():""}
              </div>
            }
          </a>
        </div>
        <Modal  visible={this.state.visible}
          // onOk={this.handleOk}
          width={400}
          footer=''
          onCancel={this.handleCancel}
        >
        <Spin tip="保存中..." spinning={this.state.spinning}>
          <div className="modal_avatar_box">
            <div className="modal_avatar">
              <Upload {...uploadProps}
              style={{display:'inline-block'}}>
                {this.state.avatar_url?
                  <img className="avatar-image" src={'/upload/avatar/'+this.state.avatar_url}
                  title="查看个人信息"/>
                  :
                  <div className="avatar-text"
                  style={{background:this.state.avatar_color}}>
                    {this.state.avatar_name?this.state.avatar_name.substr(0, 1).toLocaleUpperCase():""}
                  </div>
                }
              </Upload>
              <p style={{marginBottom:15}}>{this.props.userInfo.name}
                (
                  {this.state.edible?
                    <a href='javascript:;' onClick={this.handleSubmit.bind(this)}>保存</a>
                    :
                    <a href='javascript:;' onClick={this.enEdible.bind(this)}>编辑</a>
                  }

                )

              </p>
            </div>
            <Form>

                {this.state.edible?
                  <FormItem
                    label="性别"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 6 }}
                  >
                    {getFieldDecorator('gender', {
                      initialValue: this.props.userInfo.gender,
                      rules: [{ required: true, message: '是男是女从实招来' }],
                    })(
                      <Select placeholder="是男是女从实招来">
                        <Option value="似男似女">似男似女</Option>
                        <Option value="非男非女">非男非女</Option>
                        <Option value="非女即男">非女即男</Option>
                        <Option value="非男即女">非男即女</Option>
                        <Option value="狗男女">狗男女</Option>
                      </Select>
                    )}
                  </FormItem>
                  :
                  <FormItem
                    label="性别"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 12 }}
                  >
                    <span className="ant-form-text">{this.props.userInfo.gender}</span>
                  </FormItem>
                }
                {this.state.edible?
                  <FormItem
                    label="师从门派"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 6 }}
                  >
                    {getFieldDecorator('faction', {
                      initialValue: this.props.userInfo.faction,
                      rules: [{ required: true, message: '敢问阁下师从何人' }],
                    })(
                      <Select placeholder="敢问阁下师从何人">
                        <Option value="仁回峰">仁回峰</Option>
                        <Option value="聚首峰">聚首峰</Option>
                        <Option value="汇霞峰">汇霞峰</Option>
                        <Option value="通天峰">通天峰</Option>
                        <Option value="孤儿">孤儿</Option>
                      </Select>
                    )}
                  </FormItem>
                  :
                  <FormItem
                    label="师从门派"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 12 }}
                  >
                    <span className="ant-form-text">{this.props.userInfo.faction}</span>
                  </FormItem>
                }
                {this.state.edible?
                  <FormItem
                    label="江湖称号"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 6 }}
                  >
                    {getFieldDecorator('title', {
                      initialValue: this.props.userInfo.title,
                      rules: [{ required: true, message: '江湖人称？' }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                  :
                  <FormItem
                    label="江湖称号"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 12 }}
                  >
                    <span className="ant-form-text">{this.props.userInfo.title}</span>
                  </FormItem>
                }
                {this.state.edible?
                  <FormItem
                    label="生辰八字"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 6 }}
                  >
                    {getFieldDecorator('birth', {
                      initialValue: this.props.userInfo.birth?moment(this.props.userInfo.birth, 'YYYY-MM-DD HH:mm'):null,
                      rules: [{ required: true, message: '江湖人称？' }],
                    })(
                      <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                    )}
                  </FormItem>
                  :
                  <FormItem
                    label="生辰八字"
                    labelCol={{ span: 11 }}
                    wrapperCol={{ span: 12 }}
                  >
                    <span className="ant-form-text">{this.props.userInfo.birth?acientBirth.inq(this.props.userInfo.birth).TC:""}</span>
                  </FormItem>
                }
            </Form>

          </div>
        </Spin>






        <Button style={{width:'100%'}} onClick={this.logout.bind(this)}>退出</Button>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { app } = state
  return {
    userInfo:app.userInfo,
  }
}


Header = Form.create()(Header);
export default connect(mapStateToProps)(Header)

// export default Header
