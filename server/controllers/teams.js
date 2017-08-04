var Teams = require('../models/teams');
var User = require('../models/user');
var Contents = require('../models/contents');
var Docs = require('../models/docs');
var Article = require('../models/article');
// var fs = require('fs');
// var path = require('path');


//实验
// var formidable = require('formidable')

//创建新团队
exports.creatNewGroup = function(req,res,next){
  var user = req.session.user;
  var values = req.body.values;
  //关键词也不多，zheli9过滤下酒的了
  if(values.path.toLowerCase() == 'new'){
    return res.json({ error: true,msg:'填写的path为保留字段，换一个试试' })
  }
  Teams.findOne({path:values.path.toLowerCase()},function(err,backteams){
    if(err){
      console.log(err);
      res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(backteams){
      return res.json({ error: true,msg:'访问路径已存在,请重新填写' })
    }
    values.teamOwner = user._id;
    values.teamMember = [];
    values.teamMember.push(user._id)
    backteams = new Teams(values);

    backteams.save(function(err,teamer){
      if(err){
        console.log(err);
        res.json({ error: true,msg:'注册入库失败'+err })
      }
      User.findById(user._id,function(err,users){
        if(err){
          console.log(err);
        }
        // users.teamOwn.push(teamer._id);
        users.teamBelong.push(teamer._id);
        users.save(function(err,userN){
          if(err){
            console.log(err);
            res.json({ error: true,msg:'更新失败'+err })
          }
          //更新session中的用户
          req.session.user = userN;
          User.findById(userN._id,function(err,users3){
            if(err){
              console.log(err);
            }
            return res.json({ success: true,msg:'团队信息更新成功',teamer:teamer,userInfo:users3 })
          })

        })
      })
    })
  })
}


var packageDocToGroup = function(res,obj,authority){
  try {
    obj = obj.toObject()
  } catch (e) {
    console.log(e);
  }
  var searchArr = {parent:obj._id};
  if(!authority){
    ////不同人请求数据
    searchArr = {parent:obj._id,share:Boolean(!authority).toString()};
  }
  Docs.find(searchArr,function(err,docs){
    if(err){console.log(err);}
    obj.docs = docs;
    return res.json({ success: true,result:obj})
  })
}
//客户端请求单个团队详情
exports.searchByPath = function(req,res,next){
  var path = req.body.path;
  var user = req.session.user;
  Teams.findByPath(path.toLowerCase(),function(err,backteams){
    if(err){
      console.log(err);
      return res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(backteams){
      var authority = backteams.teamMember.map(item=>item._id.toString()).indexOf(user._id.toString()) != -1
      // console.log(authority);

      packageDocToGroup(res,backteams,authority)
    }
    else{
      return res.json({ success: false,msg:'团队不存在' })
    }
  })
}
//检查是否path、重复
exports.pathCheck = function(req,res,next){
  var path = req.body.path;
  Teams.findOne({path:path.toLowerCase()},function(err,backteams){
    if(err){
      console.log(err);
      return res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(backteams){
      return res.json({ success: false,msg:'访问路径已存在,请重新填写' })
    }
    else{
      return res.json({ success: true,msg:'访问路径不重复' })
    }
  })
}

//团队信息更新g
exports.updateGroup = function(req,res,next){
  var user = req.session.user;
  var values = req.body.values;
  var id = values._id
  Teams.findById(id,function(err,backteams){
    if(err){
      console.log(err);
      res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(values.teamName){
      backteams.teamName = values.teamName;
    }
    if(values.path){
      backteams.path = values.path;
    }
    if(values.intro){
      backteams.intro = values.intro;
    }
    if(values.avatar){
      backteams.avatar = values.avatar;
    }

    backteams.save(function(err,teamer){
      if(err){
        console.log(err);
        res.json({ error: true,msg:'注册入库失败'+err })
      }
      User.findById(user._id,function(err,users){
        if(err){
          console.log(err);
        }
        req.session.user = users;
        return res.json({ success: true,msg:'团队信息更新成功',teamer:teamer,userInfo:users })

      })
    })
  })
}
//删除单个团队
exports.deleteOne = function(req,res,next){
  var id = req.body._id;
  var user = req.session.user;
  Teams.findOne({_id:id},function(err,backteams){

    if(err){
      console.log(err);
      res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(user._id != backteams.teamOwner){
      return res.json({ success: false,msg:'您没有权限删除' })
    }
    var teamOwner = backteams.teamOwner;
    //var docs = backteams.docs;
    var teamMember = backteams.teamMember;
    /*
    * 1.内里文档库肯定要都删掉  删除文章的时候有问题，肯定得删
    * 2.所有者teamOwn得删掉     2017-07-26这个属性已经去掉了
    * 3.所有成员的belongteam得删掉
    *
    */
    backteams.remove(function(err,result){
      if(err){
        return res.json({ success: false,resultsMsg:'删除失败' })
      }

      //1.删除user中owner,默认一个团队只能有一个拥有者
      // User.findOne({_id:teamOwner},function(err,users){
        // if(err){return console.log(err)}
        // var newTeamOwn = [];
        // console.log(users);
        // users.teamOwn.map(function(item){
        //   console.log(item);
        //   if(item != id){
        //     newTeamOwn.push(item)
        //   }
        // })
        // users.teamOwn = newTeamOwn
        // users.save(function(err,userN){
        //   if(err){
        //     console.log(err);
        //     res.json({ error: true,msg:'更新失败'+err })
        //   }
          //更新session中的用户
          // req.session.user = userN;
          var userN = req.session.user;


          //这里查询全部doc的id
          Docs.find({parent:id,parentRef:'Teams'},function(err,result_docs){
            if(err) return console.log(err);
            console.log('↓↓↓↓↓↓↓↓↓↓↓ result_docs ↓↓↓↓↓↓↓↓↓↓↓↓↓');
            console.log(result_docs);
            Article.find({doc_id:{ $in:result_docs.map(item=>item._id) }},function(err,articles){
              if(err){console.log(err)}
              console.log('↓↓↓↓↓↓↓↓↓↓↓ articles ↓↓↓↓↓↓↓↓↓↓↓↓↓');
              console.log(articles);
              //删除 所删除文档所属的文章
              Article.remove({_id:{ $in:articles.map(item=>item._id) }},function(err,delArticleResult){
                if(err){
                  return res.json({ success: false,msg:'删除失败' })
                }
                //3.删除所有文章
                Docs.remove({parent:id,parentRef:'Teams'},function(err,result){
                  if(err){
                    return res.json({ success: false,resultsMsg:'删除失败' })
                  }
                  //删除所有的doc文章

                  //2.删除所有用户中的teamBelong
                  teamMember.map(function(item,index){
        	        	User.findOne({_id:item},function(err,userResult){
        			        if(err){
        			          return res.json({ success: false,resultsMsg:'查询失败' })
        			        }
                      var newteamBelong = [];
                      userResult.teamBelong.map(function(belong){
                        if(belong != id){
                          newteamBelong.push(item)
                        }
                      })
                      userResult.teamBelong = newteamBelong
                      userResult.save(function(err,finallyuser){
                        if(err){
                          console.log(err);
                          res.json({ error: true,msg:'更新失败'+err })
                        }
                        //最终返回
                        if(req.session.user._id == finallyuser._id){
                          userN = finallyuser;
                          //更新session中的用户
                          req.session.user = userN;
                        }
                        if(index == teamMember.length-1){
                          return res.json({ success: true,msg:'团队删除成功',userInfo:userN })
            	        	}
                      })
        			      })

        	        })
                })
              })
            })
          })




        // })
      // })
      // return res.json({ success: true,resultsMsg:'删除成功' })
    })

  })

}


//新增成员
exports.addMember = function(req,res,next){
  var groupId = req.body.groupId;
  var userEmail = req.body.userEmail;

  Teams.findById(groupId,function(err,backteams){
    if(err){
      console.log(err);
      return res.json({ error: true,msg:'查询团队数据库失败:'+err })
    }
    //第一步 在团队中添加用户信息
    if(backteams){
      var judgeArray = backteams.teamMember||[];
      var judgeArr = [];
      judgeArray.map(function(item){
        judgeArr.push(item.email)
      });
      if(judgeArr.join(',').indexOf(userEmail) !== -1){
        return res.json({ error: true,msg:'成员已存在' })
      }
      else{
        User.findOne({email:userEmail},function(err,user){
          if(err){
            console.log(err);
            return res.json({ error: true,msg:'查询用户数据库失败:'+err })
          }
          console.log(user._id);
          console.log(backteams.teamMember);
          backteams.teamMember.push(user._id)
          backteams.save(function(err,final){
            if(err){
              console.log(err);
              return res.json({ error: true,msg:'团队信息保存失败:'+err })
            }
            //第二步 要在用户中增加团队信息

            user.teamBelong.push(final._id)
            user.save(function(err,finalusers3){
              if(err){
                console.log(err);
                return res.json({ error: true,msg:'用户信息保存失败:'+err })
              }
              Teams.findById(final._id,function(err,groupInfo){
                if(err){
                  console.log(err);
                  return res.json({ error: true,msg:'团队信息查询失败:'+err })
                }
                return res.json({ success: true,msg:'添加成员成功',groupInfo:groupInfo||{} })
              })
            })
          })
        })


      }
    }
  })
}

//检查当前操作者id是不是和session中的登录id一致；
exports.actionAuthorityCheck = function(req,res,next){
  var groupId = req.body.groupId;
  var user = req.session.user;
  Teams.findOne({_id:groupId},function(err,backteams){
    console.log(backteams);
    if(err){
      console.log(err);
      res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(user._id != backteams.teamOwner){
      return res.json({ success: false,msg:'您没有权限' })
    }
    next()

  })
}
//检查当前操作者id是不是和session中的登录id一致；
exports.deleteMember = function(req,res,next){
  var groupId = req.body.groupId;
  var userId = req.body.userId;
  Teams.findOne({_id:groupId},function(err,backteams){
    if(err){
      console.log(err);
      return res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    var teamMember = [];
    backteams.teamMember.map(function(item){
      if(item != userId){
        teamMember.push(item)
      }
    });
    backteams.teamMember = teamMember;
    backteams.save(function(err,final){
      if(err){
        console.log(err);
        return res.json({ error: true,msg:'团队信息保存失败:'+err })
      }
      //第二步 要在用户中删除团队信息
      User.findOne({_id:userId},function(err,user){
        if(err){
          console.log(err);
          return res.json({ error: true,msg:'查询数据库失败:'+err })
        }
        var teamBelong = [];
        user.teamBelong.map(function(item){
          if(item != groupId){
            teamBelong.push(item)
          }
        })
        user.teamBelong = teamBelong;
        user.save(function(err,final){
          if(err){
            console.log(err);
            return res.json({ error: true,msg:'用户信息保存失败:'+err })
          }
          Teams.findById(groupId,function(err,groupInfo){
            if(err){
              console.log(err);
              return res.json({ error: true,msg:'团队信息查询失败:'+err })
            }
            return res.json({ success: true,msg:'删除成功',groupInfo:groupInfo||{} })
          })
        })
      })
    })

  })
}
