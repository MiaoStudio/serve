
import React from 'React'
import {Row,Col,} from 'antd'
import io from 'socket.io-client';
import TextForm from './TextForm.jsx';
import Header from './Header.jsx';
import MessageList from './MessageList.jsx';
import Toolbar from './Toolbar.jsx';
import tools from '../../utils/tools'
import { connect } from 'react-redux'
import { cbAllMessages,updateUserInfo,justReturnMessages,cbLimitMessages ,addPerNum} from '../../actions/app'


class App extends React.Component {

  constructor(props) {
    super(props);
    this.socket = io.connect(window.location.origin);

    this.socket.on('new message', (msg) => {
      this.handleNewMessageFromServer(msg);
    });
    const { dispatch } = this.props
    // dispatch(cbAllMessages())
    dispatch(cbLimitMessages(this.props.perNum))
    //请求身份
    dispatch(updateUserInfo())
  }
  componentWillUpdate(){

  }
  componentDidMount(){
    setTimeout(() => {
      console.log('100毫秒猴至于底部');
      this.focusBottom()
    }, 100)
    //为啥下面这样写不执行呢？？？？
    // setTimeout(this.focusBottom(),1000)
  }
  handleScroll(e) {
    var qq = this.refs.msgBox;
    if(qq.scrollTop == 0){
      const { dispatch } = this.props
      dispatch(addPerNum(this.props.messages.length))
    }
  }
  handleNewMessage(message) {
    // console.log('新接受到信息');
    message.userInfo = this.props.userInfo;
    this.socket.emit('sent message', message);
  }
  focusBottom(){
    console.log('bottom');
    var qq = this.refs.msgBox;
    qq.scrollTop = qq.scrollHeight;
  }
  handleNewMessageFromServer(message) {
    // console.log('返回单条新接收到的信息',message);
    let {messages,dispatch} = this.props;
    // messages.push(message);
    // console.log('获得最新的全部信息',messages);
    dispatch(justReturnMessages(messages,message))
    // this.setState({messages});

    // //定位底部
    this.focusBottom()
  }

  render() {
    // console.info(this.props.messages);
    return (
        <div className="layout">
          {/* <div className="layout_background"></div> */}
          <Header
          // userInfo={this.props.userInfo}
           />
          <div className="body">
            <div className="chat-panel">
              <div className="message-list" ref='msgBox' onScroll={this.handleScroll.bind(this)}>
                <MessageList
                // messages={this.props.messages}
                // userInfo={this.props.userInfo}
                />
              </div>
              <div className="toolbar">
                <Toolbar handleNewMessage={this.handleNewMessage.bind(this)}/>
              </div>
              <div className="input-box">
                <TextForm handleNewMessage={this.handleNewMessage.bind(this)}/>
              </div>

            </div>
          </div>
        </div>

    );
  }
}



const mapStateToProps = state => {
  const { app } = state
  return {
    messages: app.messages,
    userInfo:app.userInfo,
    perNum:app.perNum,
  }
}
export default connect(mapStateToProps)(App)
// export default App
