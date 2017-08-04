var User = require('./controllers/user');
var Contents = require('./controllers/contents');
var Teams = require('./controllers/teams');
var Docs = require('./controllers/docs');
var Article = require('./controllers/article');
var Classify = require('./controllers/classify');

module.exports = function(app){
  //pre handle user
  app.use(function(req, res, next){
    // console.log('我是reqqqqqqqqqqqqqqq吖'+req);
    var _user = req.session.user ;
    app.locals.user=_user;
    req.localProps = {}
    next()
  })


  /*
  *
  *
  * 下面这部分都是页面渲染
  *
  */
  app.get('/',User.signinRequired,function (req, res) {
      // res.render('index');
      console.log('=================== 请求了ssss ==========================');
      // res.render('index',{
      //   title:'首页',
      // })
      res.redirect('/explore')
      // res.send('后台');
  });
  app.get('/signin',User.showSignin)
  app.get('/signup',User.showSignup)

  app.get('/explore',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'探索',
      session:req.session
    })
  });


  app.get('/explore/popular',User.signinRequired,function (req, res) {
   res.render('index',{
     title:'头条',
     session:req.session
   })
  });
  app.get('/explore/classify*',User.signinRequired,function (req, res) {
   res.render('index',{
     title:'精品',
     session:req.session
   })
  });


app.get('/group/new',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'新建团队',
      session:req.session
    })
});
app.get('/group/:path',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'潮汐 | XX团队',
      session:req.session
    })
});
app.get('/group/:path/member',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'潮汐 | XX团队',
      session:req.session
    })
});
app.get('/group/:path/setting',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'潮汐 | XX团队',
      session:req.session
    })
});
app.get('/doc/new',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'新建文档',
      session:req.session
    })
});
app.get('/doc/:path',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'潮汐 | XX文档',
      session:req.session
    })
});
app.get('/doc/:path/list',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'潮汐 | 文档列表',
      session:req.session
    })
});
app.get('/doc/:path/toc',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'潮汐 | 文档目录',
      session:req.session
    })
});
app.get('/doc/:path/setting/*',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'潮汐 | 文档设置',
      session:req.session
    })
});
app.get('/doc/:path/:id',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'潮汐 | view',
      session:req.session
    })
});
app.get('/doc/:path/:slurm/edit',User.signinRequired,Article.authorityCheckRedirect,function (req, res) {
    res.render('index',{
      title:'潮汐 | Editing',
      session:req.session
    })
});

app.get('/user/:path',User.signinRequired,function (req, res) {
    res.render('index',{
      title:'潮汐 | xx用户',
      session:req.session
    })
});
//admin
app.get('/admin*',User.signinRequired,User.adminRequired,function (req, res) {
  res.render('index',{
    title:'超级管理',
    session:req.session
  })
});
//signer info setting
app.get('/setting',User.signinRequired,function (req, res) {
  res.render('index',{
    title:'个人设置',
    session:req.session
  })
});







  /*
  * 下面这部分都是ajax请求api
  *
  *
  *
  *
  *
  */
  //User
  app.post('/user/signup',User.signup)
  app.post('/user/signin',User.signin)
  app.get('/logout',User.logout)
  //



  //模糊查询user信息
  app.post('/api/user/fuzzy',User.signinRequired,User.fuzzySearch);

  //获得当前session中的用户全部信息
  app.get('/api/userInfo',User.signinRequired,User.getUserInfo);
  //获得当前session中的用户全部信息
  app.post('/api/user/viewInfo',User.signinRequired,User.getViewInfo);
  //用户更新个人信息 !!!!不接受邮箱+权限的修改参数；
  app.post('/api/user/update',User.signinRequired,User.update)

  //任意类型上传头像api
  app.post('/api/avatar',User.signinRequired,User.savedPosterOnly)


  //articles 穿件新文章
  app.post('/api/article/new',User.signinRequired,Article.checkDocPriority,Article.returnSlrum,Article.create);
  //请求用户信息
  app.post('/api/article/info',User.signinRequired,Article.addAuthorityToLocal,Article.getArticleInfo);
  //用户修改文章
  app.post('/api/article/update',User.signinRequired,Article.checkArticlePriority,Article.checkreversed,Article.updateArticleInfo);
  //用户删除文件
  app.post('/api/article/del',User.signinRequired,Article.checkArticlePriority,Article.delArticle);
  //文章内 上传图片
  app.post('/api/article/image',User.signinRequired,Contents.saveImage)



  //用户创建团队
  app.post('/api/group/new',User.signinRequired,Teams.creatNewGroup)
  //用户更新团队信息
  app.post('/api/group/update',User.signinRequired,Teams.updateGroup)
  //客户端 新建团队，检测是否path重复
  app.post('/api/group/pathCheck',User.signinRequired,Teams.pathCheck)
  //客户端 团队页面详情
  app.post('/api/group/info',User.signinRequired,Teams.searchByPath)
  //删除团队
  app.post('/api/group/delete',User.signinRequired,Teams.deleteOne)
  //添加新成员
  app.post('/api/group/addmember',User.signinRequired,Teams.actionAuthorityCheck,Teams.addMember)
  //删除成员
  app.post('/api/group/deletemember',User.signinRequired,Teams.actionAuthorityCheck,Teams.deleteMember)


  //检查文档path是否被占用  2017-06-22
  app.post('/api/doc/pathCheck',User.signinRequired,Docs.pathCheck,Docs.pathCheckRight)
  //创建新文档
  app.post('/api/doc/new',User.signinRequired,Docs.pathCheck,Docs.creatNewDoc)
  //用户更新团队信息
  app.post('/api/doc/update',User.signinRequired,Docs.actionAuthorityCheck,Docs.updateGroup)
  //客户端 文档页面详情
  app.post('/api/doc/info',User.signinRequired,Docs.searchByPath)
  //客户端 删除文档库
  app.post('/api/doc/delete',User.signinRequired,Docs.actionAuthorityCheck,Docs.deleteDoc)


  //管理员请求全部用户
  app.post('/api/admin/users',User.signinRequired,User.adminRequired,User.userlist);
  //管理员添加用户
  app.post('/api/admin/adduser',User.signinRequired,User.adminRequired,User.addUser);
  //管理员删除用户
  app.post('/api/admin/deleteuser',User.signinRequired,User.adminRequired,User.del);
  //管理员更新用户信息
  app.post('/api/admin/updateuser',User.signinRequired,User.adminRequired,User.updateUser);

  //查询分类
  app.post('/api/admin/class',User.signinRequired,User.adminRequired,Classify.query);
  //新建分类
  app.post('/api/admin/addclass',User.signinRequired,User.adminRequired,Classify.pathCheck,Classify.createNew);
  //管理员更新分类信息
  app.post('/api/admin/updateclass',User.signinRequired,User.adminRequired,Classify.pathCheck,Classify.updateClass);
  //管理员删除分类
  app.post('/api/admin/deleteclass',User.signinRequired,User.adminRequired,Classify.del);
  //管理员更新分类信息中 文章、文档、团队信息
  app.post('/api/admin/class/update',User.signinRequired,User.adminRequired,Classify.updateClassADG);


  //共享文章
  app.post('/api/explore/specific',User.signinRequired,Classify.querySpecific);
  //其他分类
  app.post('/api/explore/exceptpopular',User.signinRequired,Classify.queryexceptPopular);







  app.get('/*',function (req, res) {
    var array404 = ['cubic','light','default','monkey','shake','tv'];
    var num404 = Math.floor(Math.random()*array404.length);
    var name404 = array404[num404]||'default'
    res.render('404/'+name404,{
      title:'404',
      // session:req.session
    })
  });
}
