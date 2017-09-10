import React from 'React'
import { Form,Modal,Input } from 'antd'
const FormItem = Form.Item;

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
      this.props.handleOk(fieldsValue)
    });
  }
  handleCancel = (e) => {
    this.props.handleCancel()
  }
  render() {
    var _self = this;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title="文件名" visible={true}
        onOk={this.handleOk} onCancel={this.handleCancel}
      >
      <Form layout="inline">
          <FormItem
          labelCol={{span: 8}}
          wrapperCol={{span: 15}}
            label="文件名"
          >
            {getFieldDecorator('title', {
              rules: [{
                required: true, message: '文件名必填!',
              }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const ContentsForm = Form.create()(Contents);
export default ContentsForm
