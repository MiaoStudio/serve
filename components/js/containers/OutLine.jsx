
import React from 'React'
import {Row,Col,Dropdown,Tooltip,Icon} from 'antd'
import { connect } from 'react-redux'
import { updateUserInfo } from '../actions/app'
import QueueAnim from 'rc-queue-anim';
// import Key from 'keymaster';

// var Key = require('keymaster')(document)

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      show: false,
      url:""
    }
    const { dispatch } = this.props
    dispatch(updateUserInfo())
  }
  createImage(url,timer){
    this.setState({url:url,show:true});
    if(timer){
      setTimeout(()=>{
        this.setState({show:false})

      },timer)
    }

  }

  componentDidMount(){
    var _self = this
    key('alt+shift+1', function(e) {
      e.preventDefault();
      _self.createImage('https://zos.alipayobjects.com/rmsportal/zMTpDgCWyWekRkqFAJDO.gif',2500)
      return  false
    });
  }
  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      show: false,
      url:""
    });
  }
  render() {
    return (
      <Row style={{height:'100%'}}>
      {this.props.children}
        <QueueAnim id="kidding_gif" type={['bottom', 'bottom']}
          ease={['easeOutQuart', 'easeInOutQuart']}>
         {/* <div key="demo4" id="kidding_gif"> */}
         {this.state.show?

          <Tooltip key='imageboxs'
           title={<a href="javascript:;" onClick={this.handleClick}><Icon type="close" /></a>}>
            <img key='image' className="kidding_gif" src={this.state.url}/>
          </Tooltip>

           :
           null
         }
         {/* </div> */}
        </QueueAnim>

      </Row>
    );
  }
}


// export default Layout
const mapStateToProps = state => {
  const { app } = state
  return {

  }
}
export default connect(mapStateToProps)(Layout)
