var Docs = require('../models/docs');
var User = require('../models/user');
var Teams = require('../models/teams');
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');
//实验
var formidable = require('formidable')
var _ = require('underscore')



//检查是否path、重复
exports.pathCheck = function(req,res,next){
  var path = req.body.path;

  if(!path){
    return res.json({ success: false,msg:'缺少必要参数' })
  }
  Docs.findOne({path:path.toLowerCase()},function(err,backdocs){
    if(err){
      console.log(err);
      return res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(backdocs){
      return res.json({ success: false,msg:'访问路径已存在,请重新填写' })
    }
    else{
      next()
    }
  })
}
//返回正确paycheck status

//检查是否path、重复
exports.pathCheckRight = function(req,res,next){
  return res.json({ success: true,msg:'访问路径不重复' })
}

//创建新文档
exports.creatNewDoc = function(req,res,next){
  //走到这里说明已经path不重复，
  //判断了是否使user类型之后就可以直接保存了
  var user = req.session.user;
  var values = req.body.values;
  if(user._id === values.parent){
    values.parentRef = "User"
  }
  else{
    values.parentRef = "Teams"
  }
  var docs = new Docs(values);
  docs.save(function(err,_backdata){
    if(err){
      return console.log(err);
    }
    if(_backdata.parentRef == "User"){
      User.findById(_backdata.parent,function(err,user){
        if(err){
          console.log(err);
        }
        return res.json({ success: true,docs:_backdata,userInfo:user});
      })
    }
    else{
      Teams.findById(_backdata.parent,function(err,teamer){
        if(err){
          console.log(err);
        }
        return res.json({ success: true,docs:_backdata,group:teamer});
      })
    }

  })
}

packageDocInfo_authors = function(req,res,backdoc){
  var returnDoc = backdoc;
  var articles = returnDoc.article;
  var authors = [];
  articles.map(function(item){
    authors.push(item.author);
  });
  authors = _.uniq(authors);
  User.find({_id:{ $in:authors}},function(err,result){
    if(err){
      return res.json({ success: false,resultsMsg:'删除失败' })
    }
    returnDoc.authors = result;
    return res.json({ success: true,result:returnDoc })
  })
}

var packageDocInfo_article = function(req,res,backdoc){
  var returnDoc = backdoc
  var user = req.session.user;
  var searchArr = {doc_id:backdoc._id};

  if(backdoc.parentRef === 'User'){
    //情况一: 非文档拥有着请求，且文档父级为用户
    if(backdoc.parent.toString() != user._id.toString()){
      searchArr = {doc_id:backdoc._id,public:1,status:1};
    }
  }
  else if(backdoc.parentRef === 'Teams'){
    //情况二：非文档拥有着请求，且文档父级为团队,请求用户不属于团队成员
    if(backdoc.parentArray.teamMember.map(item=>item._id.toString()).indexOf(user._id.toString()) == -1){
      searchArr = {doc_id:backdoc._id,public:1,status:1};
    }
  }
  // console.log(searchArr);
  Article.find(searchArr,function(err,article){
    if(err){console.log(err)}
    returnDoc.article = article;
    packageDocInfo_authors(req,res,returnDoc)
  })
}

var packageDocInfo = function(req,res,backdoc){
  // console.log(backdoc);
  //mongoose特点，查了不能修改，必须toobject之后才能修改 参考（http://www.jianshu.com/p/e78fa39aa43f）
  var returnDoc = backdoc.toObject()
  if(backdoc.parentRef === 'User'){
    User.findById(backdoc.parent,function(err,user){
      if(err){
        console.log(err);
      }
      returnDoc.parentArray = user
      // console.log(returnDoc);
      packageDocInfo_article(req,res,returnDoc)
      // return res.json({ success: true,result:returnDoc})
    })
  }
  else if(backdoc.parentRef === 'Teams'){
    Teams.findById(backdoc.parent,function(err,teamer){
      if(err){
        console.log(err);
      }
      returnDoc.parentArray = teamer
      packageDocInfo_article(req,res,returnDoc)
      // return res.json({ success: true,result:returnDoc })
    })
  }
}
exports.searchByPath = function(req,res,next){
  var path = req.body.path;
  Docs.findByPath(path.toLowerCase(),function(err,backdoc){
    if(err){
      console.log(err);
      return res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(backdoc){
      packageDocInfo(req,res,backdoc)
    }
    else{
      return res.json({ success: false,msg:'文档不存在' })
    }
  })
}


//检查当前操作者id是不是和session中的登录id一致；
exports.actionAuthorityCheck = function(req,res,next){
  //当前登录用户
  var user = req.session.user;
  //回传的文档id
  var docId = req.body.values.id;
  Docs.findOne({_id:docId},function(err,backdoc){
    if(err){
      return res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(backdoc.parentRef === 'User'){
      if(user._id != backdoc.parent){
        return res.json({ success: false,msg:'您没有权限' })
      }
      next()
    }
    else{
      Teams.findOne({_id:backdoc.parent},function(err,teamer){
        if(err){console.log(err)}
        if(teamer.teamOwner != user._id){
          return res.json({ success: false,msg:'您没有权限' })
        }
        next()
      })
    }

  })
}


//doc信息更新
exports.updateGroup = function(req,res,next){
  //已经验证有权限修改了
  //走到这里说明已经path不重复，
  var user = req.session.user;
  var values =  req.body.values;
  var docId = values.id;
  Docs.findOne({_id:docId},function(err,backdoc){
    if(err){
      return res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(backdoc){
      if(values.name){
        backdoc.name = values.name
      }
      if(values.intro){
        backdoc.intro = values.intro
      }
      if(values.path){
        backdoc.path = values.path
      }
      if(values.show_menu){
        backdoc.show_menu = values.show_menu
      }
      if(values.share){
        backdoc.share = values.share
      }
      if(values.parent){
        backdoc.parent = values.parent
        if(user._id === values.parent){
          backdoc.parentRef = "User"
        }
        else{
          backdoc.parentRef = "Teams"
        }
      }
      backdoc.save(function(err,backdocNN){
        if(err){
          console.log(err);
          return res.json({ error: true,msg:'更新失败'+err })
        }
        if(backdocNN){
          packageDocInfo(req,res,backdocNN)
        }
      })
    }
    else{
      return res.json({ success: false,msg:'文档不存在' })
    }

  })
}


//删除文档库
exports.deleteDoc = function(req,res,next){
  var values =  req.body.values;
  var docId = values.id;

  Docs.remove({_id:docId},function(err,backdata){
		if(err){
			return console.log(err);
		}
		if(backdata.result.n==1&&backdata.result.ok==1){
      Article.find({doc_id:docId},'_id',function(err,articles){
        if(err){console.log(err)}
        console.log(articles);
        Article.remove({_id:{ $in:articles.map(item=>item._id) }},function(err,result){
          if(err){
            return res.json({ success: false,msg:'删除失败' })
          }
          return res.json({ success: true,msg:'删除成功',result:result})
        })
      })
		}
    else{
      return res.json({ success: false,msg:'删除失败',result:backdata})
    }

	})
}
