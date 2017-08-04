var User = require('../models/user');
var Teams = require('../models/teams');
var Docs = require('../models/docs');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs')

//实验
var formidable = require('formidable')

//signup
exports.signup = function(req,res){
  console.log(req.body);
  var _user = req.body.user;
  if(_user.email == 'yuhaiqing@eigpay.com'){
    _user.role = 100
  }
  User.findOne({email:_user.email},function(err,user){
    if(err){
      console.log(err);
      res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(user){
      console.log('邮箱已存在');
      return res.json({ error: true,msg:'邮箱已存在,请直接登录' })
      // return res.redirect('/signin')
    }else{
      user = new User(_user);
      user.save(function(err,user){
        if(err){
          console.log(err);
          res.json({ error: true,msg:'注册入库失败'+err })
        }
        // res.redirect('/signin')
        res.json({ success: true,msg:'注册成功' })
      })
    }
  })
};

//addUser
exports.addUser = function(req,res){
  console.log(req.body);
  var _user = req.body;
  _user.password = '123456'
  User.findOne({email:_user.email},function(err,user){
    if(err){
      console.log(err);
      res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(user){
      console.log('邮箱已存在');
      return res.json({ error: true,msg:'邮箱已存在' })
      // return res.redirect('/signin')
    }
    user = new User(_user);
    user.save(function(err,user){
      if(err){
        console.log(err);
        res.json({ error: true,msg:'注册入库失败'+err })
      }
      // res.redirect('/signin')
      return res.json({ success: true,msg:'新增成功',result:user })
    })
  })

};
exports.updateUser = function(req,res){
  var id = req.body._id;
  if(id){
    User.findOne({email:req.body.email},function(err,user_e){
      if(err){
        console.log(err);
        return res.json({ error: true,msg:'查询数据库失败:'+err })
      }
      if(user_e){
        console.log('邮箱已存在');
        if(user_e._id != id){
          return res.json({ error: true,msg:'邮箱已存在' })
        }
        return updateUserPackage(id,res,req)
      }
      return updateUserPackage(id,res,req)
    })

  }
}
var updateUserPackage = function(id,res,req){
  User.findById(id,function(err,user){
    if(err){
      console.log(err);
    }
    if(req.body.name){user.name = req.body.name}
    if(req.body.job){user.job = req.body.job}
    if(req.body.email){user.email = req.body.email}
    if(req.body.phone){user.phone = req.body.phone}
    if(req.body.role){user.role = req.body.role}
    if(req.body.location){user.location = req.body.location}
    if(req.body.apartment){user.apartment = req.body.apartment}
    if(req.body.password){
      user.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    }
    user.save(function(err,userN){
      if(err){
        console.log(err);
        res.json({ error: true,msg:'更新失败'+err })
      }
      res.json({ success: true,msg:'更新成功',result:userN})
    })
  })
}

exports.signin = function(req,res){
  var _user = req.body.user;
  var email = _user.email;
  var password = _user.password;
  console.log('表单中的'+_user);
  User.findOne({email:email},function(err,user){
    if(err){
      console.log(err);
      res.json({ error: true,msg:'查询数据库失败:'+err })
    }
    if(!user){

      console.log('邮箱不存在')
      // return res.redirect('/signup')
      return res.json({ error: true,msg:'邮箱不存在,请注册' })
    }
    user.comparePassword(password,function(err,isMatch){
      if(err){
        console.log(err);
      }
      if(isMatch){
        console.log('匹配');
        req.session.user = user
        return res.json({ success: true,msg:'登陆成功',path:user.email})
      }
      else{
        console.log('不匹配,密码错误');
        // return res.redirect('/signin')
        return res.json({ error: true,msg:'用户名或密码错误，请重新登录' })
      }
    })
  })
};



//logout
exports.logout = function(req,res){
  delete req.session.user;
  //delete app.locals.user;
  res.json({ success: true,msg:'成功登出' })
}


//signupNamelist page
exports.userlist = function(req,res){
  User.fetch(function(err,users){
    if(err){
      console.log(err);
    }
    return res.json({ success: true,msg:'成功',result:users })
    // res.render('userlist',{
    //   title:'用户列表页',
    //   users:users
    // })
  })
}

var randomLogin = function(){
  var array_login = ['raindow','wasteland','photoblur'];
  var num_login = Math.floor(Math.random()*array_login.length);
  var name_login = array_login[num_login]||'wasteland'
  return name_login
}
var random404 = function(){
  var array404 = ['cubic','light','default','monkey','shake','tv'];
  var num404 = Math.floor(Math.random()*array404.length);
  var name404 = array404[num404]||'default'
  return name404
}
//showSignin page
exports.showSignin = function(req,res){
    // var array_login = ['raindow','default'];
    // var num_login = Math.floor(Math.random()*array_login.length + 1);
    // var name_login = array_login[num_login]||'default'
    var name_login = randomLogin()
    res.render('login/'+name_login,{
      title:'潮汐 | 登录',
      // isSignin:false
    })
}
//showSignin page
exports.showSignup = function(req,res){
    var name_login = randomLogin()
    res.render('login/'+name_login,{
      title:'潮汐 | 注册'
    })
}



//list delete user
exports.del = function(req,res){
  var id = req.body._id;
  if(id){
    User.remove({_id:id},function(err,user){
      if(err){
        return console.log(err);
      }
      return res.json({ success: true,msg:'删除成功',result:user})
    })
  }
}

//admin updateAt
exports.update = function(req,res){
  var id = req.body.id;
  var values = req.body.values
  User.findById(id,function(err,user){
    if(err){
      console.log(err);
    }
    if(values.name){
      user.name = values.name
    }
    if(values.job){
      user.job = values.job
    }
    if(values.phone){
      user.phone = values.phone
    }
    if(values.location){
      user.location = values.location
    }
    if(values.apartment){
      user.apartment = values.apartment
    }
    if(values.avatar){
      user.avatar = values.avatar
    }
    user.save(function(err,userN){
      if(err){
        console.log(err);
        res.json({ error: true,msg:'更新失败'+err })
      }
      //万不得已吖，处理异步，
      req.session.user = userN

      res.json({ success: true,msg:'更新成功',userInfo:userN})
    })
  })
}


exports.savedPosterOnly = function(req,res,next){
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.keepExtensions = true;     //保留后缀
  form.parse(req, function(err, fields, files){
    var posterData = files.avatar_file;
    // console.log(posterData);
    var filePath = posterData.path;
    var originalFilename = posterData.name;
    if(originalFilename){
      fs.readFile(filePath,function(err,data){
        var timestamp = Date.now();
        var type = posterData.type.split('/')[1];
        var poster = timestamp + '.'+type;
        var newPath = path.join(__dirname,'../../','/public/upload/avatar/' + poster);

        fs.writeFile(newPath,data,function(err){
          req.poster = poster;
          return res.json({ success: false,avatar:'/upload/avatar/'+poster})
        })
      })
    }
    else{
      return res.json({ success: false,msg:'上传失败'})
    }
  })
}

// minddleware for user
exports.signinRequired = function(req,res,next){

  var user = req.session.user;
  if(!user){
    return res.redirect('/signin')
  }
  next()
}
exports.adminRequired = function(req,res,next){
  var user = req.session.user;
  if(user.role<100){
    // return res.json({errMsg:'您没有权限'})
    var name_404 = random404()
    return res.render('404/'+name_404,{
      title:'登录页面',
      // isSignin:false
    })
  }
  next()
}

exports.getUserInfo = function(req,res,next){
  var user = req.session.user;
  User.findById(user._id,function(err,users){
    if(err){
      console.log(err);
    }
    return res.json({ success: true,userInfo:users})
  })
}
var packageDocToUser = function(res,obj,authority){
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
  console.log(searchArr);
  Docs.find(searchArr)
  .exec(function(err,docs){
    if(err){return console.log(err)}
    obj.docs = docs ||[];
    console.log(obj.teamBelong);
    Teams.find({_id:{ $in:obj.teamBelong.map(item=>item) }})
    .populate(['teamMember','teamOwner','docs'])
    .exec(function(err,teamers){
      if(err){return console.log(err)};
      console.log(teamers);
      obj.teamBelong = teamers ||[];
      return res.json({ success: true,userInfo:obj})

    })

  })
}
exports.getViewInfo = function(req,res,next){
  var email = req.body.email;
  var user = req.session.user;
  User.findOne({email:email},function(err,userResult){
    if(err){
      return res.json({ success: false,resultsMsg:'查询失败' })
    }
    if(userResult){
      packageDocToUser(res,userResult,user._id == userResult._id)
    }
    else{
      return res.json({ success: false,userInfo:user})
    }
  })

}



//模糊查询根据关键词
exports.fuzzySearch = function(req,res){
    var keyword = req.body.keyword
    console.log(keyword);
    User.find({  $or: [ { name:new RegExp(keyword, 'i') },
                        { email:new RegExp(keyword, 'i') }
                      ] })
    .limit(10)
    .select('name email avatar avatar_color _id')
    .sort('meta.updateAt')
    .exec(function(err,users){
      if(err){
        console.log(err);
      }
      return res.json({ success: true,results:users||[]})
    })
}
