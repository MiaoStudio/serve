
import React from 'React';
import {Row,Col,Menu,Icon,Button} from 'antd';
import { connect } from 'react-redux'
import { fetchExceptPopular } from '../../actions/control'
import { Router, Route, Link, hashHistory } from 'react-router';


const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

class Index extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props
    dispatch(fetchExceptPopular())
  }

  render() {
    console.log(this.props.exceptPopularData);
    var exceptPopularData = this.props.exceptPopularData||[]
    return (
      <div className="classify_box">
        <div className="explore-header">
          <h3 className="title"><span>精品栏目</span></h3>
          <p className="description"><span>浏览不同的仓库，了解更多有价值的内容</span></p>
        </div>
        <div className="explore-body">
          <ul>
            {exceptPopularData.map(function(item,index){
              return (
                <li key={index}>
                  <Link className="categories-item"
                    to={"/explore/classify/"+item.en_name}>
                    <h4 className="title">{item.name}</h4>
                    <p className="description">{item.intro}</p>
                    <div className="count">
                      <span className="count-item">
                        <Icon type="book" />
                        <span className="count-text">{item.doclist.length} 个仓库
                        </span>
                      </span>
                      <span className="count-item">
                        <Icon type="team" />
                        <span className="count-text">{item.teamlist.length} 个团队
                        </span>
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

    );
  }
}


// export default Index
const mapStateToProps = state => {
  const { app , control } = state
  return {
    userInfo:app.userInfo,
    classifies:control.classifies,
    exceptPopularData:control.exceptPopularData,
    app:app
  }
}


export default connect(mapStateToProps)(Index)
