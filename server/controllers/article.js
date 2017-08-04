var Docs = require('../models/docs');
var User = require('../models/user');
var Teams = require('../models/teams');
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');
//实验
var formidable = require('formidable')



var randomSlrum = function(){
	var t="0123456789abcdefghijklmnopqrstuvwxyz", o="", p=0;
	while(o.length<6){
		p=Math.floor(Math.random()*99999)%t.length;
		o+=t.substr(p,1);
		//t=t.substr(0,p)+t.substring(p+1)
	}
	return o
}


//检查保留字
exports.checkreversed = function(req,res,next){
	//保留字有  list、 setting、 toc
	var slurm = req.body.slurm;
	if(slurm){
		if(!/^[a-z0-9_][a-z0-9_]{1,}$/.test(slurm)){
			return res.json({ success: false,msg:'只能输入小写字母、横线、下划线和点，至少 2 个字符'})
    }
    else if(slurm.toLowerCase() == 'list'||slurm.toLowerCase() == 'toc'||slurm.toLowerCase() == 'setting'){
      return res.json({ success: false,msg:'路径为保留字段，请修改'})
    }
		next()
	}
	else{
		next()
	}
}


var createSlrum = function(slm,docId,req,next){
	Article.findOne({slurm:slm,doc_id:docId},function(err,article){
    if(err){console.log(err)}
		if(article){
			var newSlm = randomSlrum();
			createSlrum(newSlm,docId,req,next)
		}
		else{
			req.localProps.slurm = slm;
			next()
		}
  })
}
//生成位移slurm 路径
exports.returnSlrum = function(req,res,next){
  var slm = randomSlrum();
	var doc_id = req.body.doc_id
	createSlrum(slm,doc_id,req,next);
}


//创建新的文档
exports.create = function(req,res,next){
	var user = req.session.user;
	//关于author这个参数，默认只有创建者，而不是修改者，后面更新的时候不更新author
	var obj = {
		slurm:req.localProps.slurm,
		doc_id:req.body.doc_id,
		author:user._id
	}
	var article = new Article(obj);

	article.save(function(err,art){
		if(err){return console.log(err)}
		return res.json({ success: true,msg:'创建成功',result:art })
	})
}



//根据slurm查询文章信息
exports.getArticleInfo = function(req,res,next){
	var user = req.session.user;
	var slurm = req.body.slurm
	Article.findBySlurm(slurm,function(err,article){
		if(err){
			return console.log(err);
		}
		return res.json({ success: true,msg:'搜索成功',result:article,authority:req.localProps.manageArticleAuthority})
	})
}
//加权限值
exports.addAuthorityToLocal = function(req,res,next){
	var user = req.session.user;
	var slurm = req.body.slurm
	Article.findBySlurm(slurm,function(err,article){
		if(err){
			return console.log(err);
		}
		Docs.findOne({_id:article.doc_id})
				.exec(function(err,doc){
					if(err){return res.json({success:false,err:err})};
					if(doc.parentRef === 'User'){
				    if(doc.parent.toString() == user._id.toString()){
							req.localProps.manageArticleAuthority = true
				      next();
				    }
						else{
							req.localProps.manageArticleAuthority = false
				      next();
						}
				  }
					else if(doc.parentRef === 'Teams'){
						Teams.findById(doc.parent,function(err,teamer){
				      if(err){return console.log(err)};
							if(teamer){
								if(teamer.teamMember.map(item=>item._id.toString()).indexOf(user._id.toString()) == -1){
									req.localProps.manageArticleAuthority = false
						      next();
								}
								else{
									req.localProps.manageArticleAuthority = true
						      next();
								}
							}
							else{
								req.localProps.manageArticleAuthority = false
					      next();
							}

				    })
				  }

				})
	})
}




//更新文档内容
exports.updateArticleInfo = function(req,res,next){
	var user = req.session.user;
	var slurm = req.body.slurm;
	var body = req.body.body;
	var title = req.body.title;
	var _id = req.body._id;
	//第一步判断slurm是否重复
	Article.findOne({_id:_id},function(err,article){
		if(err){
			return console.log(err);
		}
		if(!article){
			return res.json({ success: false,msg:'搜索无此文档'})
		}
		if(!slurm){
			//如果没有slurm，就可以直接保存了
			// return updateFn({body:body,title:title},res,article)
			return updateFn(req.body,res,article)
		}
		else{
			//存在slurm,就要先判断是不是新的slurm，如果不是再判断是不是存在相同slurm，如果不存在，继续保存
			if(article.slurm == slurm){
				//不是新的slurm，直接保存
				// return updateFn({body:body,title:title},res,article)
				return updateFn(req.body,res,article)
			}
			else{
				Article.findOne({slurm:slurm,doc_id:article.doc_id},function(err,art){
					if(err){return console.log(err)};
					if(!art){
						//不存在，说明不冲突slurm，可以保存
						// return updateFn({body:body,title:title,slurm:slurm},res,article)
						return updateFn(req.body,res,article)
					}
					else{
						return res.json({ success: false,msg:'路径冲突，请修改'})
					}
				})
			}

		}


	})
}

//更新article方程
var updateFn = function(obj,res,article){
	if(obj.hasOwnProperty('body')) article.body = obj.body;
	if(obj.hasOwnProperty('title')) article.title = obj.title;
	if(obj.slurm) article.slurm = obj.slurm;

	if(obj.intro) article.intro = obj.intro;
	if(obj.cover) article.cover = obj.cover;

	if(obj.status) article.status = obj.status;
	if(obj.public==0||obj.public==1) article.public = obj.public;
	article.save(function(err,art){
		if(err){return console.log(err)}
		return res.json({ success: true,msg:'修改成功',result:art })
	})
}

var checkPriorityByDocID = function(req,res,next,doc_id){
	//一定会传doc_id
	console.log(req.mehtod);
	var user = req.session.user;
	Docs.findOne({_id:doc_id})
			.exec(function(err,doc){
				if(err){return res.json({success:false,err:err})};
				if(doc.parentRef === 'User'){
			    if(doc.parent.toString() == user._id.toString()){
			      next();
			    }
					else{
						return res.json({ success: false,msg:"您没有权限"})
					}
			  }
				else if(doc.parentRef === 'Teams'){
					Teams.findById(doc.parent,function(err,teamer){
			      if(err){return console.log(err)};
						if(teamer){
							if(teamer.teamMember.map(item=>item._id.toString()).indexOf(user._id.toString()) == -1){
								return res.json({ success: false,msg:"您没有权限"})
							}
							else{
								next();
							}
						}
						else{
							return res.json({ success: false,msg:"操作失败，请联系开发者"})
						}

			    })
			  }

			})
}
//验证是否有doc操作权限
exports.checkDocPriority = function(req,res,next){
	var doc_id = req.body.doc_id;
	checkPriorityByDocID(req,res,next,doc_id)
}

//验证是否当前文章操作权限
exports.checkArticlePriority = function(req,res,next){
	var _id = req.body._id;
	Article.findOne({_id:_id},function(err,backdata){
		if(err){return console.log(err)};
		checkPriorityByDocID(req,res,next,backdata.doc_id)
	})
}

//删除操作
exports.delArticle = function(req,res,next){
  var _id = req.body._id;
	Article.remove({_id:_id},function(err,backdata){
		if(err){
			return console.log(err);
		}
		if(backdata.result.n==1&&backdata.result.ok==1){
			return res.json({ success: true,msg:'删除成功',result:backdata})
		}
		return res.json({ success: false,msg:'删除失败',result:backdata})
	})
}

//用于导航，没有权限就要跳转
exports.authorityCheckRedirect = function(req,res,next){
	var slurm = req.params.slurm;
	console.log(req.body);
	Article.findBySlurm(slurm,function(err,backdata){
		if(err){return console.log(err)};
		checkPriorityByDocIDToRedirect(req,res,next,backdata.doc_id)
	})
}
var checkPriorityByDocIDToRedirect = function(req,res,next,doc_id){
	//一定会传doc_id
	var user = req.session.user;
	var path = req.params.path;
	var slurm = req.params.slurm;
	Docs.findOne({_id:doc_id})
			.exec(function(err,doc){
				if(err){return res.json({success:false,err:err})};
				if(doc.parentRef === 'User'){
			    if(doc.parent.toString() == user._id.toString()){
			      next();
			    }
					else{
						return res.redirect('/doc/'+path+'/'+slurm)
					}
			  }
				else if(doc.parentRef === 'Teams'){
					Teams.findById(doc.parent,function(err,teamer){
			      if(err){return console.log(err)};
						if(teamer){
							if(teamer.teamMember.map(item=>item._id.toString()).indexOf(user._id.toString()) == -1){
								return res.redirect('/doc/'+path+'/'+slurm)
							}
							else{
								next();
							}
						}
						else{
							return res.redirect('/doc/'+path+'/'+slurm)
						}

			    })
			  }

			})
}
