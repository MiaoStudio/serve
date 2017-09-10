
import React from 'React'
import { Form , Icon} from 'antd'
import './catalog.less'
class DocCatalog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var _self = this;

    return (

          <div className="catalog_component">
            <div className="typo">
             <div className="typo-catalog">
              <ul className="typo-catalog-detail">

                <li>
                  <span className="typo-catalog-detail-item typo-catalog-detail-item-1">
                    <span className="name">
                      <Icon type="caret-down" className="catalog-folder"/>
                      &nbsp;
                      <a href="/wb-yuhaiqing.a/gv1ohe/welcome-to-tide">Welcome</a>
                    </span>
                    <span className="slug">
                      <a href="/wb-yuhaiqing.a/gv1ohe/welcome-to-tide">welcome-to-tide</a>
                    </span>
                  </span>
                </li>
               <li><span className="typo-catalog-detail-item typo-catalog-detail-item-2"><span className="name">
                  &nbsp;
                  <a href="/wb-yuhaiqing.a/gv1ohe/how-to-write">How to write the document</a></span><span className="slug"><a href="/wb-yuhaiqing.a/gv1ohe/how-to-write">how-to-write</a></span></span></li>
               <li><span className="typo-catalog-detail-item typo-catalog-detail-item-1"><span className="name">
                  &nbsp;
                  <a href="/wb-yuhaiqing.a/gv1ohe/about">About</a></span><span className="slug"><a href="/wb-yuhaiqing.a/gv1ohe/about">about</a></span></span></li>
              </ul>
             </div>
            </div>
          </div>

    );
  }
}

export default DocCatalog
