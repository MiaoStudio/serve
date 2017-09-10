
import React from 'React'
import {Row,Col,Badge,Card,Button,Select ,message,Popconfirm } from 'antd'
import { Router, Route, Link, hashHistory ,browserHistory} from 'react-router';
import UserAvatar from '../../components/UserAvatar.jsx';
import {  returnGroupInfoState  } from '../../actions/group'
import tools from '../../utils/tools'
import { connect } from 'react-redux';
const Option = Select.Option;




let timeout;
let currentValue;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    tools.ajax({
         url: '/api/user/fuzzy',
         method: 'POST',
         data:JSON.stringify({keyword:value}),
         headers:{'Content-Type':'application/json'},
         async: true,
         dataType:'json'
     })
    .then(function (xhr) {
      //  console.log(xhr.response.success);
       if(xhr.response.success){
         callback(xhr.response.results);
       }
       else{

       }
    },
    function (e) {
      console.log(JSON.stringify(e))
    })
  }

  timeout = setTimeout(fake, 300);
}

class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      searchVisible:false,
      data:[]
    }
  }
  showSearch(){
    this.setState({searchVisible:true})
  }
  handleChange = (value) => {
    this.setState({ value });
    if(value){
      if(value.trim()){
        console.log(value.trim());
        fetch(value, data => this.setState({ data }));
      }
    }
  }
  updateMember(e){
    console.log(e);
    var _self = this;
    var judgeArray = this.props.groupInfo.teamMember||[];
    var judgeArr = [];
    judgeArray.map(function(item){
      judgeArr.push(item.email)
    });
    if(judgeArr.join(',').indexOf(e) !== -1){
      message.error('成员已存在')
    }
    else{
      tools.ajax({
           url: '/api/group/addmember',
           method: 'POST',
           data:JSON.stringify({userEmail:e,groupId:this.props.groupInfo._id}),
           headers:{'Content-Type':'application/json'},
           async: true,
           dataType:'json'
       })
      .then(function (xhr) {
         console.log(xhr.response);
         if(xhr.response.success){
           const { dispatch } = _self.props
           dispatch(returnGroupInfoState(xhr.response.groupInfo))
         }
         else{

         }
      },
      function (e) {
        console.log(JSON.stringify(e))
      })
    }
  }
  deleteMember(obj){
    var _self = this;
    console.log(obj);
    tools.ajax({
         url: '/api/group/deletemember',
         method: 'POST',
         data:JSON.stringify({userId:obj._id,groupId:this.props.groupInfo._id}),
         headers:{'Content-Type':'application/json'},
         async: true,
         dataType:'json'
     })
    .then(function (xhr) {
       console.log(xhr.response);
       if(xhr.response.success){
         const { dispatch } = _self.props
         dispatch(returnGroupInfoState(xhr.response.groupInfo))
       }
       else{

       }
    },
    function (e) {
      console.log(JSON.stringify(e))
    })
  }
  render() {
    var _self  = this;
    var teamMember = this.props.groupInfo.teamMember ||[];
    var teamOwner = this.props.groupInfo.teamOwner?this.props.groupInfo.teamOwner._id:null;
    var loginer = this.props.userInfo._id;
    const options = this.state.data.map(d => <Option value={d.email} key={d.email}>
                                              <UserAvatar userInfo={d}/>
                                              <span className="selectOptionsTitle" >
                                                {d.name}({d.email})
                                              </span>
                                            </Option>);
    var searchDom = <Select
                      style={{width:280}}
                      mode="combobox"
                      value={this.state.value}
                      placeholder="搜索用户并添加"
                      notFoundContent=""
                      // style={this.props.style}
                      onSelect={this.updateMember.bind(_self)}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onChange={this.handleChange}
                    >
                      {options}
                    </Select>

    return (
      <Row>
          <Card title="文档列表"
            className="noPadding"
            extra={
              this.props.isAuthority?
              <span>
                {!this.state.searchVisible?<Button type="primary" style={{top:-4}}
              onClick={this.showSearch.bind(this)}>
                                          添加成员
                                        </Button>:searchDom}
              </span>
              :null
              } >
                <ul className="group-members">
                  {teamMember.map(function(item,index){
                    return (
                      <li className="group-members-item clearfix" key={index}>
                        <Link to={"/user/"+item.email}>
                          <UserAvatar userInfo={item}/>
                          <h4 className="login">{item.name}</h4>
                        </Link>
                        <span className="email">{item.email}</span>
                        {
                          teamOwner === loginer? //判断是不是创建者！
                          <div className="action clearfix">
                            <div className="action-role">
                              <div className="action-role-name"><span>{teamOwner===item._id?"Owner":"Member"}</span></div>
                            </div>
                            {item._id === teamOwner?null:
                              <Popconfirm title="是否确定将该成员从组里删除？"
                                onConfirm={_self.deleteMember.bind(_self,item)}
                                okText="确定"
                                cancelText="取消">
                                <a href="javascript:;" className="action-remove">删除</a>
                              </Popconfirm>
                            }
                          </div>
                          :
                          <div className="action clearfix">
                            <div className="action-role">
                              <div className="action-role-name"><span>{teamOwner===item._id?"Owner":"Member"}</span></div>
                            </div>
                          </div>
                        }

                      </li>
                    )
                  })}
                </ul>
          </Card>
      </Row>
    );
  }
}


// export default Contents
const mapStateToProps = state => {
  const { app , routing , group} = state
  return {
    userInfo:app.userInfo,
    routeProps:routing,
    isAuthority:group.isAuthority,
    groupInfo:group.groupInfo
  }
}
export default connect(mapStateToProps)(Contents)
