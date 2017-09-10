
import React from 'React'
import {Row,Col,Menu,Icon,Card,Form,Input,Upload,Button,Radio,Tooltip,Select } from 'antd';
import { connect } from 'react-redux'
import tools from '../../utils/tools'
import { retrunParentInfo } from '../../actions/article'
import { browserHistory } from 'react-router'
import Nav from '../Nav.jsx'
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
    tools.fixDocumentName('新建文档')
  }
  handleSubmit(){
    var _self = this;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.type="document"
        tools.ajax({
             url: '/api/doc/new',
             method: 'POST',
             data:JSON.stringify({values:values,path:values.path}),
             headers:{'Content-Type':'application/json'},
             async: true,
             dataType:'json'
         })
        .then(function (xhr) {
           console.log(xhr.response.success);
           if(xhr.response.success){
             browserHistory.push('/doc/'+xhr.response.docs.path)
           }
           else{
             message.error('创建失败')
           }
        },
        function (e) {
          console.log(JSON.stringify(e))
        })
      }
    });
  }
  componentWillUnmount() {
    console.log('卸载');
    const { dispatch } = this.props;
    dispatch(retrunParentInfo({}));

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
    const { getFieldDecorator } = this.props.form;
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
      <Row>
        <Col span={3}></Col>
        <Col span={18} >
          <Row gutter={16} style={{paddingTop:15}}>
            <Card>
              <h1>新建文档</h1>
              <p>管理和组织文档</p>
              <Form style={{marginTop:20}}>
                <FormItem
                  label={<span style={{    fontWeight: 700,    fontSize: 14}}>类型</span>}
                  labelCol={{span:24}}
                  wrapperCol={{span:24}}
                >
                  <div className="ant-col-xs-24 ant-col-sm-8">
                    <a className="tide-card tide-card-active">
                      <h4 className="tide-card-title">
                        <Icon type="book" />
                        文档
                      </h4>
                      <span className="tide-card-description">可以存放个人笔记，产品文档，API 文档等</span>
                    </a>
                  </div>
                </FormItem>
                <FormItem
                  label={<span style={{    fontWeight: 700,    fontSize: 14}}>名称</span>}
                  labelCol={{span:24}}
                  wrapperCol={{span:12}}
                  // hasFeedback
                >
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true, message: '请输入文档名称',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                  wrapperCol={{span:12}}
                  extra={'这将用来生成仓库的访问路径，尽量短、语义化，方便记住与分享'}
                  // validateStatus=""
                  // help=""
                >
                  <Row>
                    <Col span={11}>
                      <FormItem>
                      {getFieldDecorator('parent', {
                        initialValue: this.props.parentInfo._id||this.props.userInfo._id,
                        // rules: [{
                        //   required: true, message: '文档所属必填',
                        // }],
                      })(
                        <Select dropdownMatchSelectWidth={false}>
                          {optionArray}
                        </Select>
                      )}
                      </FormItem>
                    </Col>
                    <Col span={2}><p className="ant-form-split">/</p></Col>
                    <Col span={11}>
                      <FormItem>
                      {getFieldDecorator('path', {
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
                  wrapperCol={{span:16}}
                  hasFeedback
                >
                  {getFieldDecorator('intro', {
                  })(
                    <Input  type="textarea" rows="3"/>
                  )}
                </FormItem>
                <FormItem
                >
                  {getFieldDecorator('share', {
                    initialValue:'false',
                    rules: [{
                      required: true, message: '',
                    }],
                  })(
                    <RadioGroup>
                        <Tooltip title={
                          <span className="permission-settings-type-info">
                            <span className="type-info-title">内网公开</span>
                            <span className="type-info-desc">仓库内容在公司内网可阅读</span>
                          </span>
                        }>
                        <RadioButton value="true">
                          <Icon type="home" />
                        </RadioButton>
                        </Tooltip>

                        <Tooltip title={
                          <span className="permission-settings-type-info">
                            <span className="type-info-title">私密</span>
                            <span className="type-info-desc">仅团队成员可以查看</span>
                          </span>
                        }>
                        <RadioButton value="false">
                          <Icon type="lock" />
                        </RadioButton>
                        </Tooltip>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem>
                  <Button style={{width:100}} type="primary"  size="large" onClick={this.handleSubmit.bind(this)}>新建</Button>
                </FormItem>
              </Form>
            </Card>
          </Row>


        </Col>
        <style>
          {`
            .selectOptionsTitle {
              display: inline-block;
              float: left;
              padding: 0 8px;
              font-size: 14px;
              line-height: 30px;
              overflow: hidden;
              text-overflow: ellipsis;
              height: 30px;
              white-space: nowrap;
              max-width: 150px;
            }
            .tide-card {
                display: block;
                border: 1px solid #e9e9e9;
                border-radius: 4px;
                padding: 10px 12px;
                margin-right: 10px;
                font-size: 12px;
                line-height: 1.35;
                color: #999;
            }
            .tide-card-active {
                border-color: #108ee9;
                background-color: #f7f8ff;
            }
            .tide-card-title {
                margin-bottom: 5px;
                font-size: 14px;
                color: #666;
            }
            .tide-card-description{
              color: #999;
            }
          `}
        </style>
      </Row>

    );
  }
}

const mapStateToProps = state => {
  const { app , article} = state
  return {
    userInfo:app.userInfo,
    parentInfo:article.parentInfo,
  }
}


export default connect(mapStateToProps)(Form.create()(Contents))
