import React from 'React'
import { Form,Modal,Input,Cascader, Select,InputNumber} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;


class Contents extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleOk = (e) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // debugger
      fieldsValue._id = this.props.selectedItem._id
      this.props.handleOk(fieldsValue)
    });
  }
  handleCancel = (e) => {
    this.props.handleCancel()
  }
  render() {
    var _self = this;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
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
    return (
      <Modal title={this.props.selectedItem._id?"编辑用户":"新增用户" }
        visible={true}
        onOk={this.handleOk} onCancel={this.handleCancel}
      >
      <Form layout="horizontal">
          <FormItem
          {...formItemLayout}
            label="姓名"
          >
            {getFieldDecorator('name', {
              initialValue: this.props.selectedItem.name,
              rules: [{
                required: true, message: '姓名必填!',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
          {...formItemLayout}
            label="职位"
          >
            {getFieldDecorator('job', {
              initialValue: this.props.selectedItem.job,
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
          label="邮箱"
          hasFeedback
        >
          {getFieldDecorator('email', {
            initialValue: this.props.selectedItem.email,
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: '邮箱必填!',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
        {...formItemLayout}
          label="密码"
        >
          {getFieldDecorator('password', {
            initialValue: "",
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="权限"
        >
          {getFieldDecorator('role', {
            initialValue: this.props.selectedItem.role||0,
            rules: [{ required: true, message: '权限必填!' }],
          })(
            <InputNumber min={0} max={100} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="电话"
        >
          {getFieldDecorator('phone', {
            initialValue: this.props.selectedItem.phone,
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(
            <Input addonBefore={prefixSelector} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所在地区"
        >
          {getFieldDecorator('location', {
            // initialValue: ['浙江', '杭州', '德力西'],
            initialValue: this.props.selectedItem.location?this.props.selectedItem.location.split(","):['浙江', '杭州', '德力西'],
            rules: [{ type: 'array', required: true, message: '所在地区必填' }],
          })(
            <Cascader options={residences} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所在部门"
        >
          {getFieldDecorator('apartment', {
            // initialValue: ['仁聚汇通', '杭州事业部', '技术部'],
            initialValue: this.props.selectedItem.apartment?this.props.selectedItem.apartment.split(","):['仁聚汇通', '杭州事业部', '技术部'],
            rules: [{ type: 'array', required: true, message: '所在部门必填' }],
          })(
            <Cascader options={apartments} />
          )}
        </FormItem>
        </Form>
      </Modal>
    );
  }
}

const ContentsForm = Form.create()(Contents);
export default ContentsForm
