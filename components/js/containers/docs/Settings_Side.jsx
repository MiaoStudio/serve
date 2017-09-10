
import React from 'React'
import {Row,Col,Badge,Icon,Button,Card} from 'antd'
import { connect } from 'react-redux';
import { Router, Route, Link, hashHistory } from 'react-router';
import Headers from './Head.jsx'

class Contents extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){

  }
  render() {
    return (
      <nav className="stantard-side">
        <ul className="list">
          <li>
            <Link className={!this.props.isActive?"list-item list-item-active":"list-item"} to={"/doc/"+this.props.path+"/setting"}>
              基础设置
            </Link>
          </li>
          <li>
            <Link className={this.props.isActive?"list-item list-item-active":"list-item"} to={"/doc/"+this.props.path+"/setting/advanced"}>
              高级设置
            </Link>
          </li>
        </ul>
      </nav>

    );
  }
}


// export default Contents
const mapStateToProps = state => {
  const { app , routing , group,docs} = state
  return {
    userInfo:app.userInfo,
    routeProps:routing,
    docInfo:docs.docInfo,
  }
}
export default connect(mapStateToProps)(Contents)
