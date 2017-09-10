
import React from 'React'
import ReactDOM from 'react-dom';
import {Row,Col,Menu,Icon,Breadcrumb, Alert,Dropdown,Message,Card,Button} from 'antd';
import { Router, Route, Link, hashHistory ,browserHistory} from 'react-router';
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim';
import {  } from '../../actions/code'
import moment from 'moment'
import { updateParentInfo } from '../../actions/article'
import tools from '../../utils/tools'

// import './Content.less'
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;
class Content_Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentsList:[],
      clickId:"",
    };
  }
  componentDidMount(){


  }
  componentWillReceiveProps(props){

  }
  componentDidUpdate(prevProps){

  }

  creatNewDoc(obj){
    const { dispatch } = this.props
    dispatch(updateParentInfo(obj));
  }
  render() {
    var _self = this;
    var authority = this.props.userInfo._id == this.props.myDocumentsUserData._id;
    console.log(authority);
    return (
      <Card title="我的文档"
        className="noPadding "
        extra={
          authority?
          <Button type="primary" style={{top:-4}}

          onClick={this.creatNewDoc.bind(this,this.props.userInfo)}>
                              新建文档
                            </Button>:null}
        >
        <Row >
          <ul className="projects">
            {this.props.contentsList.length != 0?
              this.props.contentsList.map(function(item,index){
              // if(item.type === 'file'){
                return (
                  <li className="projects-item" key={index}>
                    <h2 className="name">
                      <Link to={"/doc/"+item.path}
                      className="link"
                      >
                        {item.type==='document'?<Icon type="book" style={{color:'#999'}}/>:null}
                        <span className="name-text">{item.name}</span>
                        {item.share === 'false'?<span className="name-lock"><Icon type="lock" /></span>:null}

                      </Link>
                    </h2>
                    <p className="desc">{item.intro}</p>
                    <p className="time">{moment(item.meta.createAt).locale('en').fromNow()}</p>
                  </li>
                )

            })
            :null
            }
          </ul>

          <QueueAnim type={['bottom', 'bottom']}
            ease={['easeOutQuart', 'easeInOutQuart']}>
            {this.props.contentsList.length != 0?null:
              // <div className="" key='blowlion'>
                <iframe src='/views/specials/thillthelion.html' width="100%"
                style={{
                  position:'absolute',left:0,top:50,zIndex:0,
                  minHeight:200,
                }} key='blowlion11'></iframe>
              // </div>
            }
          </QueueAnim>

        </Row>
        <style>{`
          .ant-card-body {

            min-height:200px
          }
        `}</style>
      </Card>


    );
  }
}


// export default Content
const mapStateToProps = state => {
  const { app ,code, routing } = state;
  // console.error(state);
  return {
    userInfo:app.userInfo,
    contentsList:app.myDocumentsUserData.docs || [],
    myDocumentsUserData:app.myDocumentsUserData,
    // currentId:code.currentId,
    routeProps:routing,
    // results:code.results,
  }
}


export default connect(mapStateToProps)(Content_Index)
