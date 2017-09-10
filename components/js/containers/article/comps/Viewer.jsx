
import React from 'React'
import { Icon , Breadcrumb ,Menu, Button ,Dropdown , Badge,Tooltip } from 'antd'
import { Router, Route, Link, hashHistory } from 'react-router';

// import marked from  '../../../utils/tide-marked';





class Viewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      markedDom:"",
    };
  }
  componentDidMount(){

  }
  render() {
    var _self = this;
    // var value = this.props.articleInfo.body||""
    // var domValue = marked(value);
    // // console.log(marked);
    return (
        <div className="main-wrapper-doc-article">
          <div className="doc-article">
            <article className="doc-article-inner">
              <h1 className="typo-title">{this.props.articleInfo.title}</h1>
              <div className="typo typo-github"
                dangerouslySetInnerHTML={{__html: this.props.domValue}} id="J-doc"/>
            </article>

          </div>
        </div>
    );
  }
}
export default Viewer
