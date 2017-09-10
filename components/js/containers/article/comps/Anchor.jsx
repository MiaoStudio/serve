import React from 'React'
import ReactDOM from 'react-dom';
import { Anchor  } from 'antd'
import './anchor.less'
const { Link } = Anchor;

class AnchorDom extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorData:[]
    };
  }
  componentDidMount(){
    //如果是第一次加载就又，那么也得加载一次
    if(this.props.domValue){
      var domValue = this.props.domValue
      var domArray = domValue.split('\n')
      // console.log(domArray);
      var anchorData = [];
      domArray.map(function(item){
        // var str = item.replace(/<(h[1-3])\sid="(.)"><a\sclass="anchor"\shref="."><span\sclass="octicon\socticon-link"><\/span><\/a>(.)<\/h1>/,'花钱哈哈')
        if(/<(h[1-3])\sid="(.+)"><a\sclass="anchor"\shref=".+"><span\sclass="octicon\socticon-link"><\/span><\/a>(.*)<\/h[1-3]>/.test(item)){
          var ori_str = item.match(/<(h[1-3])\sid="(.+)"><a\sclass="anchor"\shref=".+"><span\sclass="octicon\socticon-link"><\/span><\/a>(.*)<\/h[1-3]>/g,'{"type":"$1","hash":"$2","text":"$3"}')[0];
          var str = ori_str.replace(/<(h[1-3])\sid="(.+)"><a\sclass="anchor"\shref=".+"><span\sclass="octicon\socticon-link"><\/span><\/a>(.*)<\/h[1-3]>/g,'{"type":"$1","hash":"$2","text":"$3"}');
          if(str){
            // debugger
            var array = JSON.parse(str);
            anchorData.push(array);
          }
        }

      });
      this.setState({anchorData})
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.domValue != this.props.domValue){
      console.error(nextProps.domValue != this.props.domValue);
      var domValue = nextProps.domValue
      var domArray = domValue.split('\n')
      // console.log(domArray);
      var anchorData = [];
      domArray.map(function(item){
        // var str = item.replace(/<(h[1-3])\sid="(.)"><a\sclass="anchor"\shref="."><span\sclass="octicon\socticon-link"><\/span><\/a>(.)<\/h1>/,'花钱哈哈')
        if(/<(h[1-3])\sid="(.+)"><a\sclass="anchor"\shref=".+"><span\sclass="octicon\socticon-link"><\/span><\/a>(.*)<\/h[1-3]>/.test(item)){
          var ori_str = item.match(/<(h[1-3])\sid="(.+)"><a\sclass="anchor"\shref=".+"><span\sclass="octicon\socticon-link"><\/span><\/a>(.*)<\/h[1-3]>/g,'{"type":"$1","hash":"$2","text":"$3"}')[0];
          var str = ori_str.replace(/<(h[1-3])\sid="(.+)"><a\sclass="anchor"\shref=".+"><span\sclass="octicon\socticon-link"><\/span><\/a>(.*)<\/h[1-3]>/g,'{"type":"$1","hash":"$2","text":"$3"}');
          if(str){
            // debugger
            var array = JSON.parse(str);
            anchorData.push(array);
          }
        }

      });
      this.setState({anchorData})
    }
  }
  render() {
    var _self = this;
    var docInfo = this.props.docInfo||{};


    return (
      <div className="doc-page-nav" style={{top:this.props.scrollOver60?'50px':'110px'}}>
        <Anchor>
          {this.state.anchorData.map(function(item,index){
            var num = item.type.replace(/[^0-9]/ig,"");
            // 机智
            var dom = <span>{item.text}</span>;
            if(num == 2){
              dom = <span>&nbsp;&nbsp;&nbsp;&nbsp;{item.text}</span>;
            }
            else if(num == 3){
              dom = <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.text}</span>;
            }
            return (
                <Link key={index}
                  style={{paddingLeft:20}}
                  href={"#"+item.hash} title={dom} />
            )
          })}
      </Anchor>
      </div>
    );
  }
}
export default AnchorDom
