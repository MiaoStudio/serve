
import React from 'React'
import { Input,Form} from 'antd';
import io from 'socket.io-client';

class TextForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value:''
    }
  }
  handleSubmit() {
    if(this.state.value.trim()){
      const timestamp = Date.now().valueOf();
      this.props.handleNewMessage({
        message: this.state.value,
        timestamp: timestamp
      });
      this.setState({value: ''});
    }
  }
  onKeyDown(key){
    if(key.keyCode==13){
      this.handleSubmit()
    }
  }
  onChange(e){
    this.setState({value:e.target.value})
  }
  render() {
    return (
      <Input
      onChange={this.onChange.bind(this)}
      onKeyDown={this.onKeyDown.bind(this)}
      value={this.state.value}
      size="large" placeholder="蛤蛤蛤"  />

    );
  }
}

export default TextForm
