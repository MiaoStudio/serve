
import React from 'React'
import {Row,Col,Badge,Icon,Button,Card,Tooltip} from 'antd'
import { connect } from 'react-redux';
import { Router, Route, Link, hashHistory } from 'react-router';
import './catalog.less'
import UserAvatar from '../../components/UserAvatar.jsx';
import DocCatalog from '../../components/DocCatalog.jsx';
class Contents extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){

  }
  render() {

    return (
      <Card bodyStyle={{ padding: 0 ,minHeight:600}}>
        <div className="catalog">
          {this.props.isAuthority?
            <Link to={"/doc/"+this.props.docInfo.path+"/toc"} className="catalog-editor">
              <Icon type="edit" />
            </Link>
          :null}
          <div>
           <h1 className="catalog-title"><span>
             {this.props.docInfo.name}
           </span></h1>
           <div className="catalog-meta">
            <div className="desc">
             {this.props.docInfo.intro}
            </div>
           </div>
           <Row type="flex" justify="center" className="catalog-meta catalog-meta-user">
             {this.props.docInfo.authors.map(function(item){
               return (
                 <Col span={3} key={item._id} className="catalog-meta-user-item">
                   <Tooltip placement="top" title={item.name}>
                     <Link to={"/user/"+item.email}>
                       <UserAvatar userInfo={item}/>
                     </Link>
                   </Tooltip>
                 </Col>
               )
             })}

          </Row>

          </div>
          <DocCatalog/>
         </div>
     </Card>

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
    isAuthority:docs.isAuthority,
  }
}
export default connect(mapStateToProps)(Contents)
