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
  checkpath(rule, value, callback){
    console.log(value && /\w/.test(value));
    if (value && !/\w/.test(value)) {
      callback('匹配包括下划线的任何单词字符');
    } else {
      callback();
    }
  }
  render() {
    var _self = this;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal title={this.props.selectedItem._id?"编辑分类":"新增分类" }
        visible={true}
        onOk={this.handleOk} onCancel={this.handleCancel}
      >
      <Form layout="horizontal">
          <FormItem
          {...formItemLayout}
            label="标题"
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
            label="路径"
          >
            {getFieldDecorator('en_name', {
              initialValue: this.props.selectedItem.en_name,
              rules: [{
                required: true, message: '路径必填!',
              },{
                validator: this.checkpath,
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
          {...formItemLayout}
            label="简介"
          >
            {getFieldDecorator('intro', {
              initialValue: this.props.selectedItem.intro,
              // rules: [{
              //   required: true, message: '简介必填!',
              // }],
            })(
              <Input type="textarea"/>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const ContentsForm = Form.create()(Contents);
export default ContentsForm
