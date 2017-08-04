var Classify = require('../models/classify');
var Article = require('../models/article');
var Docs = require('../models/docs');
var User = require('../models/user');
var Teams = require('../models/teams');
//新建class
exports.createNew = function(req,res,next){
	//保留字有  list、 setting、 toc
	var obj = {};
	obj.en_name = req.body.en_name;
	obj.intro = req.body.intro;
	obj.name = req.body.name;
	var classify = new Classify(obj);
	classify.save(function(err,_backdata){
    if(err){return console.log(err)};
		return res.json({success:true,msg:"新建成功",result:_backdata})
	})
}
//检查保留字
exports.pathCheck = function(req,res,next){

	var _id = req.body._id;
	var en_name = req.body.en_name;
	if(!en_name){
		return res.json({success:false,msg:"路径必填"})
	}

	Classify.findByPath(en_name.toLowerCase(),function(err,callbackData){
    if(err){
      console.log(err);
      return res.json({ error: true,msg:'查询数据库失败:'+err })
    }
		//查无classify，那就直接可以用这个ename，不论有没有id
    if(!callbackData){
			return next()
    }
		//如果存在返回值，先判断有没有id，没有id那就是新建，必然不能使用这个ename
		if(!_id){
			return res.json({ success: false,msg:'访问路径已存在,请重新填写' })
		}
		//存在返回值，存在id，就要判断次返回值的_id是不是和回传id一致，一致就可以继续保存，不一致，
		//说明路径已存在，不能继续保存
		if(_id != callbackData._id){
			//编辑状态的check
			return res.json({ success: false,msg:'访问路径已存在,请重新填写' })
		}
    next()
  })
}

//更新class
//此刻enname不重复，可以直接保存
exports.updateClass = function(req,res,next){
	// var en_name = req.body.en_name;
	var _id = req.body._id;
	Classify.findOne({_id:_id},function(err,callbackData){
		if(!callbackData){
			return res.json({success:false,msg:"查无此条数据",result:{}})
		}
    if(req.body.name){callbackData.name = req.body.name}
		if(req.body.en_name){callbackData.en_name = req.body.en_name}
		if(req.body.intro){callbackData.intro = req.body.intro}
		callbackData.save(function(err,_backdata){
	    if(err){return console.log(err)};
			return res.json({success:true,msg:"更新成功",result:_backdata})
		})

  })
}

exports.updateClassADG = function(req,res,next){


	//一定存在
	var class_id = req.body.class_id;
	var type = req.body.type;
	var action = req.body.action;
	Classify.findOne({_id:class_id},function(err,callbackData){
		if(err){return res.json({success:false,msg:"查询失败",result:{}})}
		if(!callbackData){
			return res.json({success:false,msg:"查无此条数据",result:{}})
		}
		//先判断更新内容的类型，包括文档，文章和团队
		if(type == 'article'){
			// 可能不存在，瞎填的
			var aticle_id = req.body.aticle_id;
			Article.findOne({_id:aticle_id},function(err,art){
				if(err){return res.json({success:false,msg:"查询失败or查无结果"})};
				if(!art){
					return res.json({success:false,msg:"查询无此文章"})
				}
				console.log(action);
				//此刻判断操作类型 删除或者 新增
				if(action == 'ADD'){
					var newarticlelist = callbackData.articlelist;
					if(newarticlelist.indexOf(aticle_id)!= -1){
						return res.json({success:false,msg:"改文章已存在"})
					}
					newarticlelist.push(aticle_id);
					callbackData.articlelist = newarticlelist;
					callbackData.save(function(err,_backdata){
				    if(err){return console.log(err)};
						return res.json({success:true,msg:"更新成功",result:_backdata})
					})
				}
				else if(action == 'DELETE'){
					var newarticlelist = [];
					callbackData.articlelist.map(function(item){
						if(item != aticle_id){
							newarticlelist.push(item)
						}
					});
					console.log(newarticlelist);
					callbackData.articlelist = newarticlelist;
					callbackData.save(function(err,_backdata){
				    if(err){return console.log(err)};
						return res.json({success:true,msg:"更新成功",result:_backdata})
					})
				}

			})
		}
		else if(type == 'doc'){
			var doc_id = req.body.doc_id;
			Docs.findOne({_id:doc_id},function(err,doc){
				if(err){return res.json({success:false,msg:"查询失败or查无结果"})};
				if(!doc){
					return res.json({success:false,msg:"查询无此文档"})
				}
				console.log(action);
				//此刻判断操作类型 删除或者 新增
				if(action == 'ADD'){
					var newdoclist = callbackData.doclist;
					if(newdoclist.indexOf(doc_id)!= -1){
						return res.json({success:false,msg:"该文档已存在"})
					}
					newdoclist.push(doc_id);
					callbackData.doclist = newdoclist;
					callbackData.save(function(err,_backdata){
				    if(err){return console.log(err)};
						return res.json({success:true,msg:"更新成功",result:_backdata})
					})
				}
				else if(action == 'DELETE'){
					var newdoclist = [];
					callbackData.doclist.map(function(item){
						console.log(item);
						console.log(doc_id);
						if(item != doc_id){
							newdoclist.push(item)
						}
					});
					console.log(newdoclist);
					callbackData.doclist = newdoclist;
					callbackData.save(function(err,_backdata){
				    if(err){return console.log(err)};
						return res.json({success:true,msg:"更新成功",result:_backdata})
					})
				}

			})
		}
		else if(type == 'group'){
			var group_id = req.body.group_id;
			Teams.findOne({_id:group_id},function(err,team){
				if(err){return res.json({success:false,msg:"查询失败or查无结果"})};
				if(!team){
					return res.json({success:false,msg:"查询无此团队"})
				}
				console.log(action);
				//此刻判断操作类型 删除或者 新增
				if(action == 'ADD'){
					var newteamlist = callbackData.teamlist;
					if(newteamlist.indexOf(group_id)!= -1){
						return res.json({success:false,msg:"该团队已存在"})
					}
					newteamlist.push(group_id);
					callbackData.teamlist = newteamlist;
					callbackData.save(function(err,_backdata){
				    if(err){return console.log(err)};
						return res.json({success:true,msg:"更新成功",result:_backdata})
					})
				}
				else if(action == 'DELETE'){
					var newteamlist = [];
					callbackData.teamlist.map(function(item){
						console.log(item);
						console.log(group_id);
						if(item != group_id){
							newteamlist.push(item)
						}
					});
					console.log(newteamlist);
					callbackData.teamlist = newteamlist;
					callbackData.save(function(err,_backdata){
				    if(err){return console.log(err)};
						return res.json({success:true,msg:"更新成功",result:_backdata})
					})
				}

			})
		}
		else{
			return res.json({success:false,msg:"更新类型错误"})
		}

  })

}

//查询 class 仅限于admin
exports.query = function(req,res,next){
	//保留字有  list、 setting、 toc
	var en_name = req.body.en_name
	if(en_name){
		Classify.findByPath(en_name.toLowerCase(),function(err,callbackData){
			if(err){
				console.log(err);
				return res.json({ error: true,msg:'查询数据库失败:'+err })
			}
			return res.json({ success: true,msg:'查询成功',result:callbackData })
		})
	}
	else{
		Classify.fetch(function(err,callbackData){
	    if(err){
	      console.log(err);
	    }
			//继续populate 文章中的作者和文章所属，仓库不用，团队暂时也不用
			callbackData.map(function(item,index){
				var articlelist = item.articlelist;
				Article.find({_id:{ $in:articlelist.map(item=>item._id) }})
				.populate(['doc_id','author'])
				.exec(function(err,articles){
					// console.log(articles);
					item.articlelist = articles;
					if(index == callbackData.length-1){
						return res.json({ success: true,msg:'查询成功',result:callbackData });
					}
				});
			});
	  })
	}

}



//删除单个 分类
exports.del = function(req,res){
  var id = req.body._id;
  if(id){
    Classify.remove({_id:id},function(err,back){
      if(err){
        return console.log(err);
      }
      return res.json({ success: true,msg:'删除成功',result:back})
    })
  }
}



//查询 class 任何人可查询
exports.querySpecific = function(req,res,next){
		var en_name = req.body.en_name
		Classify.findByPath(en_name,function(err,callbackData){
			if(err){return console.log(err);}
			if(!callbackData){
				return res.json({ success: fasle,msg:'查无结果' });
			}
			callbackData = callbackData.toObject();
			var articlelist = callbackData.articlelist;
			Article.find({_id:{ $in:articlelist.map(item=>item._id) }})
			.populate(['doc_id','author'])
			.exec(function(err,articles){
				// console.log(articles);
				callbackData.articlelist = articles;

				//查询推荐文档的父级信息,绝对只有一条信息。但是会有多条文档信息

				if(callbackData.doclist.length>0){
					callbackData.doclist.map(function(item,index){
						if(item.parentRef == 'User'){
					    User.findById(item.parent,function(err,user){
					      if(err){return console.log(err)}
					      item.parentArray = user;
								if(index == callbackData.doclist.length-1){
									return res.json({ success: true,msg:'查询成功',result:callbackData });
								}

					    })
					  }
					  else if(item.parentRef === 'Teams'){
					    Teams.findById(item.parent,function(err,teamer){
					      if(err){
					        return console.log(err);
					      }
					      item.parentArray = teamer
								if(index == callbackData.doclist.length-1){
									return res.json({ success: true,msg:'查询成功',result:callbackData });
								}
					    })
					  }
					});
				}
				else{
					return res.json({ success: true,msg:'查询成功',result:callbackData });

				}



			});
	  })

}


//查询 除了popular以外的分类
exports.queryexceptPopular = function(req,res,next){

		Classify.find({en_name:{ $ne : "popular" }})
		.populate(['doc_id','author'])
		.exec(function(err,classfies){
			if(err){
				return console.log(err);
			}
			return res.json({ success: true,msg:'查询成功',result:classfies });

		})

}
