
import React from 'React'
import {Row,Col,Menu,Icon,Card,Form,Input,Upload,Button,Radio,Tooltip,Select } from 'antd';
import { connect } from 'react-redux';
import { Router, Route, Link, hashHistory } from 'react-router';
import Side from './Settings_Side.jsx'
import { updateDocInfo } from '../../actions/docs'
import tools from '../../utils/tools'
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Contents extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){

  }
  handleSubmit(){
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { dispatch } = this.props;
        values.id = this.props.docInfo._id
        values.path = this.props.docInfo.path
        dispatch(updateDocInfo(values));
      }
    });
  }
  validatePath(rule, value, callback){
    if(value && value!==this.props.path){
      if(!/^[a-z][a-z0-9_]{1,}$/.test(value)){
        callback('只能输入小写字母、横线、下划线和点，至少 2 个字符')
      }
      else if(value.toLowerCase() == 'new'){
        callback('路径 new 为保留路径，请更换')
      }
      else{
        tools.ajax({
             url: '/api/doc/pathCheck',
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
  render() {
    // console.log(this.props.docInfo);
    var parentArray = this.props.docInfo.parentArray ||{}
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title="文档设置"
        className="">
        <Form>

          <FormItem
            label={<span style={{    fontWeight: 700,    fontSize: 14}}>名称</span>}
            labelCol={{span:24}}
            wrapperCol={{span:18}}
            // hasFeedback
          >
            {getFieldDecorator('name', {
              initialValue: this.props.docInfo.name,
              rules: [{
                required: true, message: '请输入文档名称',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{span:18}}
            extra={'这将用来生成仓库的访问路径，尽量短、语义化，方便记住与分享'}
            // validateStatus=""
            // help=""
          >
            <Row>
              <Col span={11}>
                <FormItem>
                {getFieldDecorator('parent', {
                  initialValue: parentArray._id,
                })(
                  <Select disabled dropdownMatchSelectWidth={false}>
                    <Option value={parentArray._id} key='uniquerkey'>
                      {parentArray.avatar?
                        <img className="avatar-image" src={parentArray.avatar}
                          key='img'
                          style={{height:20,width:20,margin:'5px 0',display:'inline-block',float:'left'}}
                          title="查看个人信息"/>
                        :
                        <div className="avatar-text"
                          key='text'
                        style={{height:20,width:20,margin:'5px 0',float:'left',background:parentArray.avatar_color}}
                        >
                          {parentArray.name?parentArray.name.substr(0, 1).toLocaleUpperCase():""}
                        </div>
                      }
                      <span className="selectOptionsTitle" >
                        {parentArray.name?parentArray.name:parentArray.teamName}
                        ({parentArray.email?parentArray.email:parentArray.path})
                      </span>
                    </Option>
                  </Select>
                )}
                </FormItem>
              </Col>
              <Col span={2}><p className="ant-form-split">/</p></Col>
              <Col span={11}>
                <FormItem>
                {getFieldDecorator('path', {
                  initialValue: this.props.docInfo.path,
                  validateTrigger: 'onBlur',
                  rules: [{
                    required: true, message: '访问路径不能为空',
                  },
                  {validator: this.validatePath.bind(this)},
                  ],
                }
                )(
                  <Input/>
                )}
                </FormItem>
              </Col>
            </Row>

          </FormItem>
          <FormItem
            label={<span style={{    fontWeight: 700,    fontSize: 14}}>简介</span>}
            labelCol={{span:24}}
            wrapperCol={{span:20}}
          >
            {getFieldDecorator('intro', {
              initialValue: this.props.docInfo.intro,

            })(
              <Input  type="textarea" rows="3"/>
            )}
          </FormItem>
          <FormItem>
            <Button style={{width:100}} type="primary"  size="large" onClick={this.handleSubmit.bind(this)}> 更 新 </Button>
          </FormItem>
        </Form>
      </Card>

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
    path:docs.docInfo.path,
  }
}
export default connect(mapStateToProps)(Form.create()(Contents))
