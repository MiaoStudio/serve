
import React from 'React'
import { Form } from 'antd'
import acientBirth from '../utils/acientBirth'
const FormItem = Form.Item;

class Msg_Modal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {visible: false};
  }
  render() {
    console.info(this.props.userInfo);
    var _self = this;
    return (

          <div className="modal_avatar_box">
            <div className="modal_avatar">

              {this.props.userInfo.avatar?
                <img className="avatar-image" src={'/upload/avatar/'+this.props.userInfo.avatar}
                title="查看个人信息"/>
                :
                <div className="avatar-text"
                style={{background:this.props.userInfo.avatar_color}}>
                  {this.props.userInfo.name?this.props.userInfo.name.substr(0, 1).toLocaleUpperCase():""}
                </div>
              }
              <p style={{marginBottom:15}}>{this.props.userInfo.name}</p>
            </div>
            <Form>
              <FormItem
                label="性别"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 12 }}
              >
                <span className="ant-form-text">{this.props.userInfo.gender}</span>
              </FormItem>

              <FormItem
                label="师从门派"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 12 }}
              >
                <span className="ant-form-text">{this.props.userInfo.faction}</span>
              </FormItem>


              <FormItem
                label="江湖称号"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 12 }}
              >
                <span className="ant-form-text">{this.props.userInfo.title}</span>
              </FormItem>


              <FormItem
                label="生辰八字"
                labelCol={{ span: 11 }}
                wrapperCol={{ span: 12 }}
              >
                <span className="ant-form-text">{this.props.userInfo.birth?acientBirth.inq(this.props.userInfo.birth).TC:""}</span>
              </FormItem>

            </Form>

          </div>
    );
  }
}

export default Msg_Modal
