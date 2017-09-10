
import React from 'React'
import Moment from 'moment'
import { Form ,Modal } from 'antd'
import { connect } from 'react-redux'
import Msg_Modal from '../../components/Msg_Modal.jsx'
const FormItem = Form.Item;

class MessageList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {visible: false,userInfo:{}};
  }
  showModal = (userInfo) => {
    console.log(userInfo);
    this.setState({
      visible: true,
      userInfo
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  Message(props){
    let userInfo = props.message.userInfo;
    return (
      <div className="message-list-item" key={props.key}>
        <div className={userInfo._id == this.props.userInfo._id?"native-message message-self":"native-message"}>
        <a href="javascript:;" onClick={this.showModal.bind(this,userInfo)}>
        {userInfo.avatar?
          <img className="avatar-image" src={"/upload/avatar/"+userInfo.avatar}
          title="查看个人信息"/>
          :
          <div className="avatar-text"
          style={{background:userInfo.avatar_color}}>
            {userInfo.name?userInfo.name.substr(0, 1).toLocaleUpperCase():""}
          </div>
        }
        </a>

          <div>
            <div>
              <span className="message-username">
              {props.message.userInfo.title}
              </span>
              <span>{Moment(props.message.timestamp).format('HH:mm:ss')}</span>
            </div>
            <div className="text">
              {props.message.message}
            </div>
          </div>
        </div>
      </div>
    )
  }
  render() {
    // console.info(this.props.messages);
    var _self = this;
    return (
      <div ref='abc'>
        {this.props.messages.map(function(item,index){
          return _self.Message({message: item,key:index})
        })}
        <Modal  visible={this.state.visible}
          // onOk={this.handleOk}
          width={400}
          footer=''
          onCancel={this.handleCancel}
        >
        <Msg_Modal
        userInfo={this.state.userInfo}
        />
        </Modal>
      </div>
    );
  }
}



const mapStateToProps = state => {
  const { app } = state
  return {
    messages: app.messages,
    userInfo:app.userInfo,
  }
}
export default connect(mapStateToProps)(MessageList)
// export default MessageList
