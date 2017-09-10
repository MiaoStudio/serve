
import React from 'React'
import { Icon , Popover , Tabs} from 'antd';


const TabPane = Tabs.TabPane;

class Toolbar extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value:''
    }
  }

  render() {

    const content = (
      <Tabs defaultActiveKey="1"
      tabPosition='bottom'>
        <TabPane tab={<span>{<Icon type="apple" />}</span>} key="1">AS</TabPane>
        <TabPane tab={<span><Icon type="android" /></span>} key="2">Content of Tab Pane 2</TabPane>
        <TabPane tab={<span><Icon type="apple" /></span>} key="3">Content of Tab Pane 3</TabPane>
      </Tabs>
    );
    return (
    <div>
    <Popover
    content={content}
    // title="Title"
    trigger="click">
      <Icon type="smile-o" size='large' style={{fontSize:24}} />
    </Popover>

    <Icon type="code-o" size='large' />
    <span></span>
    </div>

    );
  }
}

export default Toolbar
