
import React from 'React'
import { Form } from 'antd'

class UserAvatar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var _self = this;
    return (

              this.props.userInfo.avatar?
                <img className="avatar" src={this.props.userInfo.avatar}
                title="查看个人信息"/>
                :
                <div className="avatar-text"
                style={{background:this.props.userInfo.avatar_color}}>
                  {this.props.userInfo.name?this.props.userInfo.name.substr(0, 1).toLocaleUpperCase():""}
                </div>

    );
  }
}

export default UserAvatar
