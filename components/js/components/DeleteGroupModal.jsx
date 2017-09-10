import React from 'React'
import { Form,Modal,Input,Cascader, Select,InputNumber,Alert,Button} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;


class Contents extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      path:this.props.data.path,
      label:this.props.data.teamName?"团队":"文档"
    };
  }
  handleOk = (e) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.handleOk()
    });
  }
  handleCancel = (e) => {
    this.props.handleCancel()
  }
  validatePath(rule, value, callback){
    if(value == this.state.path){
      callback()
    }
    else{
      callback('输入的路径名称错误, 请重新输入')
    }
  }
  render() {
    var _self = this;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
    };

    return (
      <Modal title={"删除"+this.state.label}
        visible={true}
        onCancel={this.handleCancel}
        footer=""
      >
        <Alert
          message="请慎重！"
          description={"你现在的操作是删除"+ this.state.label +'&nbsp;'+ this.props.data.teamName +"，该操作不可逆，一旦操作成功，"+ this.state.label +"下的所有资源将会删除。请输入"+ this.state.label +"路径名称再次确定"}
          type="error"
        />
      <Form layout="horizontal">
          <FormItem
          {...formItemLayout}
            label={"请输入 "+ this.state.path +" 以确认:"}
            required
          >
            {getFieldDecorator('path', {
              rules: [{
                required: true, message: this.state.label+'路径名称!',
              },
              {validator: this.validatePath.bind(this)},],

            })(
              <Input placeholder={this.state.path}/>
            )}
          </FormItem>
            <Button
            onClick={this.handleOk.bind(this)}
            style={{width:'100%'}} type="danger">
              确定删除{this.state.label}
            </Button>
        </Form>
      </Modal>
    );
  }
}

const ContentsForm = Form.create()(Contents);
export default ContentsForm
