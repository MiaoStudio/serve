
import React from 'React';
import { Form , Icon,Input,Button , Table ,Popconfirm,Row,message,Tooltip ,Upload } from 'antd';
import { addItemToClassify } from '../actions/control'
import { updateArticleInfo } from '../actions/article'


const FormItem = Form.Item;


class AddArticleToClassify extends React.Component {

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
        obj.aticle_id = values._id;
        obj.class_id = this.props.data._id;
        obj.type = 'article';
        obj.action = 'ADD'
        dispatch(addItemToClassify(obj))
      }
    });
  }
  deleteItem(record){
    var obj = {};
    obj.aticle_id = record._id;
    obj.class_id = this.props.data._id;
    obj.type = 'article';
    obj.action = 'DELETE'
    const { dispatch } = this.props;
    dispatch(addItemToClassify(obj))
  }
  addCoverToArticle(e){
    e.preventDefault();
    const { dispatch } = this.props

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if(!values.cover){
          return message.error("请填写简介")
        }
        var obj = {};
        obj._id = values._id;
        obj.cover = values.cover;
        obj.slurm = values.slurm;
        dispatch(updateArticleInfo(obj))
      }
    });
  }
  addIntroToArticle(e){
    e.preventDefault();
    const { dispatch } = this.props

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if(!values.intro){
          return message.error("请填写简介")
        }
        var obj = {};
        obj._id = values._id;
        obj.intro = values.intro;
        obj.slurm = values.slurm;
        dispatch(updateArticleInfo(obj))
      }
    });
  }
  render() {
    var _self = this;
    console.log(this.props);
    const { getFieldDecorator } = this.props.form;

    let uploadProps = {
      name: 'file',
      action: '/api/article/image',
      showUploadList:false,
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          message.error('头像大小不能超过 1MB!');
        }
        return isLt1M;
      },
      onChange(info) {
        const { response } = info.file;
        if (info.file.status === 'done') {
          if(response && response.success) {
            message.success("上传成功")
            this.props.form.setFieldsValue({cover:response.result.url})
          } else  {
            message.error("上传失败", 3);
          }
        }
      },
    }


    const columns = [{
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width:200,
    },{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width:200,
      render: text => <a href="#">{text}</a>,
    }, {
      title: 'Slurm',
      dataIndex: 'slurm',
      key: 'slurm',
      width:50,
    }, {
      title: '是否公开',
      dataIndex: 'public',
      key: 'public',
      width:50,
    },{
      title: '是否发布',
      dataIndex: 'status',
      key: 'status',
      width:50,
    },{
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      width:300,
      render: (text, record) => (
        <Upload {...uploadProps}>
          <img src={record.cover} style={{width:250}}
            title="查看个人信息"/>
        </Upload>
      ),
    },{
      title: '简介',
      dataIndex: 'intro',
      key: 'intro',
      width:400,
      render: (text, record) => (
        <Tooltip placement="top" title={record.intro}>
          {record.intro.substring(0,12)}
        </Tooltip>
      ),
    }, {
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
              <Row>
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

              </Row>


              <Row>
                <FormItem
                  label="intro">
                    {getFieldDecorator('intro', {
                      // rules: [{
                      //   required: true, message: 'intro',
                      // }],
                    })(
                      <Input placeholder="intro" type="textarea"/>
                    )}
                </FormItem>
                <FormItem>
                  <Button type="primary" onClick={this.addIntroToArticle.bind(this)}>
                    添加介绍
                  </Button>
                </FormItem>
              </Row>
              <Row>
                <FormItem
                  label="cover">
                    {getFieldDecorator('cover', {
                    })(
                      <Input placeholder="cover" />
                    )}
                </FormItem>
                <FormItem>
                  <Button type="primary" onClick={this.addCoverToArticle.bind(this)}>
                    添加封皮
                  </Button>
                </FormItem>
              </Row>
            </Form>
            <Table
              scroll={{ x:1200 }}
              rowKey={record => record._id}
              columns={columns}
              dataSource={this.props.data.articlelist} />
          </div>

    );
  }
}

export default Form.create()(AddArticleToClassify);
// export default (Groups)
