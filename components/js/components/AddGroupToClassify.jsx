
import React from 'React';
import { Form , Icon,Input,Button , Table ,Popconfirm} from 'antd';
import { addItemToClassify } from '../actions/control'
const FormItem = Form.Item;
class AddGroupToClassify extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  addItem(e){
    e.preventDefault();
    const { dispatch } = this.props

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        var obj = {};
        obj.group_id = values._id;
        obj.class_id = this.props.data._id;
        obj.type = 'group';
        obj.action = 'ADD'
        dispatch(addItemToClassify(obj))
      }
    });
  }
  deleteItem(record){
    var obj = {};
    obj.group_id = record._id;
    obj.class_id = this.props.data._id;
    obj.type = 'group';
    obj.action = 'DELETE'
    const { dispatch } = this.props;
    dispatch(addItemToClassify(obj))
  }
  render() {
    var _self = this;
    console.log(this.props);
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    },{
      title: '名称',
      dataIndex: 'teamName',
      key: 'teamName',
      render: text => <a href="#">{text}</a>,
    }, {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Popconfirm title="确定删除?"
            onConfirm={this.deleteItem.bind(this,record)}
            // onCancel={cancel}
            okText="确定"
            cancelText="取消">
            <a href="javascript:;"><Icon type="delete" /></a>

          </Popconfirm>

        </span>
      ),
    }];
    return (

          <div>
            <Form layout="inline">

              <FormItem
                label="_id">
                  {getFieldDecorator('_id', {
                    rules: [{
                      required: true, message: '文章id必填',
                    }],
                  })(
                    <Input placeholder="_id"/>
                  )}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.addItem.bind(this)}>
                  添加
                </Button>
              </FormItem>
            </Form>
            <Table
              rowKey={record => record._id}
              columns={columns}
              dataSource={this.props.data.teamlist} />
          </div>

    );
  }
}

export default Form.create()(AddGroupToClassify);
