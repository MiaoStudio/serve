
import React from 'React'
import {Row,Col,Form, Icon, Input, Button, Checkbox ,message} from 'antd';
import tools from '../utils/tools'
const FormItem = Form.Item;



class SignUpForm extends React.Component {
  handleSubmit(e){
   e.preventDefault();
   this.props.form.validateFields((err, values) => {
     debugger
     if (err) {
       return console.log('error: ', err);
     }
     var user = {};
     user.email = values.email;
     user.name = values.name;
     user.password = values.password
    //  console.log(JSON.stringify({user:user}));
     tools.ajax({
          url: '/user/signup',
          method: 'POST',
          data:JSON.stringify({user:user}),
          headers:{'Content-Type':'application/json'},
          async: true,
          dataType:'json'
      })
    .then(function (xhr) {
        console.log(xhr);
        console.log(xhr.response);
        let res = xhr.response;
        if(res.error){
            return message.error(res.msg);
            // return window.location.href = '/signin'
        }
        if(res.success){
          message.success(res.msg);
          setTimeout("window.location.href = '/signin'",1000)

        }
     },
     function (e) {
       console.log(JSON.stringify(e))
     })
   });
 }
 componentDidMount(){
   document.title='潮汐 | 注册'
 }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (

      <Row style={{height:'100%'}}>
      <div className="layout">
        <div className="layout_background"></div>
        <Row style={{marginTop:'150px'}}>
          <Col xs={10} sm={8} md={6} lg={4} xl={4} offset={10}>
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form" style={{padding: '15px',
            borderRadius: '5px',
            background: 'rgba(255, 255, 255, 0.34)',}}>
              <FormItem>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '用户名必填' }],
                })(
                  <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [{
                    type: 'email', message: '请输入正确邮箱!',
                  },{ required: true, message: '邮箱必填' }],
                })(
                  <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="请输入注册邮箱" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                )}
              </FormItem>
              <FormItem>
                {/* {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox>记住密码</Checkbox>
                )} */}
                {/* <a className="login-form-forgot">忘记密码</a> */}
                <Button style={{width:'100%'}} type="primary" htmlType="submit" className="login-form-button">
                  注 册
                </Button>
                已经是注册用户？<a href='/signin'>登录</a>
              </FormItem>
            </Form>
          </Col>
        </Row>

      </div>

      </Row>
    );
  }
}

const SignUp = Form.create()(SignUpForm);
export default SignUp
