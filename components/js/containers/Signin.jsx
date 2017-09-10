
import React from 'React'
import {Row,Col,Form, Icon, Input, Button, Checkbox,message } from 'antd';

import { connect } from 'react-redux'
import { fetch } from '../actions/signin'

import tools from '../utils/tools'
const FormItem = Form.Item;


class SigninForm extends React.Component {
  handleSubmit(e){
   e.preventDefault();
   const { dispatch } = this.props

   this.props.form.validateFields((err, values) => {
     if (err) {
       return console.log(err);
     }
     var user = {};
     user.email = values.email;
     user.password = values.password;
     dispatch(fetch(user))
   });
 }
 componentDidMount(){
   document.title='潮汐 | 登录'
 }
  render() {
    const { getFieldDecorator } = this.props.form;
    console.log('views',this.props.signin);
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
                {getFieldDecorator('email', {
                  rules: [{
                    type: 'email', message: '请输入正确邮箱!',
                  },{ required: true, message: '请输入注册邮箱' }],
                })(
                  <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="请输入注册邮箱" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码!' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox>记住密码</Checkbox>
                )}
                {/* <a className="login-form-forgot">Forgot password</a> */}
                <Button style={{width:'100%'}} type="primary" htmlType="submit" className="login-form-button">
                  登 录
                </Button>
                还没有注册？<a href='/signup'>注册</a>
              </FormItem>
            </Form>
          </Col>
        </Row>

      </div>

      </Row>
    );
  }
}

const mapStateToProps = state => {
  const { signin } = state

  return {
    signin,
  }
}
const Signin = Form.create()(SigninForm);
// export default Signin
export default connect(mapStateToProps)(Signin)
