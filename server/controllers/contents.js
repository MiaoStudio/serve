var Contents = require('../models/contents');
var fs = require('fs');
var path = require('path');
//实验
var formidable = require('formidable')

exports.saveImage = function(req,res){
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.keepExtensions = true;     //保留后缀
  console.log(req.body);
  form.parse(req, function(err, fields, files){
    // console.log(files.file);
    var posterData = files.file;
    // console.log(posterData);
    var filePath = posterData.path;
    var originalFilename = posterData.name;
    if(originalFilename){
      fs.readFile(filePath,function(err,data){
        var timestamp = Date.now();
        var type = posterData.type.split('/')[1];
        var poster = timestamp + '.'+type;
        var newPath = path.join(__dirname,'../../','/public/upload/articleSource/' + poster);
        // console.log(newPath);
        fs.writeFile(newPath,data,function(err){
          req.poster = poster;
          return res.json({ success: true,msg:'上传成功',result:{url:'/upload/articleSource/'+poster,filename:poster} })
        })
      })
    }
    else{
      return res.json({ error: true,msg:'上传失败' })
    }
  })
}


exports.contentsSave = function(req,res){
  var user = req.session.user;
  var data = req.body;
  console.log(data);
  var obj = {};
  obj.type = data.type;
  obj.editor = data.userInfo._id;
  obj.title = data.title;
  obj.parent = data.parent;
  obj.parents = data.parents;

  var contents = new Contents(obj);
  contents.save(function(err,_backdata){
    if(err){
      return console.log(err);
    }
    if(obj.parent){
      Contents.findById(obj.parent,user._id,function(err,innerCont){
        if(err){
          console.log(err);
        }
        innerCont.children.push(_backdata._id);
        innerCont.save(function(err,innerContN){
          if(err){
            console.log(err);
            return res.json({ error: true,msg:'更新失败'+err })
          }
        })
      })
    }
    return res.json({ success: true,results:_backdata})
  })
}


exports.contentsUpdate = function(req,res){
  var user = req.session.user;
  var data = req.body;
  id = req.body._id;
  title = req.body.title
  content = req.body.content;

  Contents.findById(id,user._id,function(err,fallbackData){
    if(err){
      console.log(err);
    }
    if(!fallbackData){return res.json({ success: false,msg:'查询失败or该文档已删除'})}
    if(title){ fallbackData.title = title }
    if(content){ fallbackData.content = content }
    fallbackData.save(function(err,fallbackData_sn){
      if(err){
        console.log(err);
        res.json({ error: true,msg:'更新失败'+err })
      }
      return res.json({ success: true,msg:'更新成功',results:fallbackData_sn})
    })
  })


}

exports.contentsQueryPublish = function(req,res){

    var id = req.query.id;
    var user = req.session.user;
    if(!id){
    	console.log('****************id*************',id)
      Contents.fetchPublic(function(err,results){
      	console.log('*****************************',err)
        if(err){
          return console.log(err);
        }
        return res.json({ success: true,results:results })
      })
    }
    else{
      Contents.findByIdPublic(id,function(err,results){
        if(err){
          return console.log(err);
        }
        return res.json({ success: true,results:results })
      })
    }

}
exports.contentsQuery = function(req,res){

    var id = req.query.id;
    var user = req.session.user;
    if(!id){
      Contents.fetch(user._id,function(err,results){
        if(err){
          return console.log(err);
        }
        return res.json({ success: true,results:results })
      })
    }
    else{
      Contents.findById(id,user._id,function(err,results){
        if(err){
          return console.log(err);
        }
        return res.json({ success: true,results:results })
      })
    }

}

/*
这个方法用于在删除folder的时候包含子项目
要把所有子项目的id全部提取，用于最后删除步骤；
*/

exports.packageFolderDeleteArray = function(req,res,next){
    console.log("我要在这里组装针对folder的删除数组",req.body);
    var user = req.session.user;
    var id = req.body._id;
    var type = req.body.type;
    var mapAll = 0;
    var mapAdd = 0;

    if(type=='file'){
      next();
    }
    else{
      req.folderDeleteArray = [id];
      var getFolderId = function(innerId){
        Contents.findById(innerId,user._id,function(err,innerCont){
          if(err){
            // return res.json({ success: false,resultsMsg:'查询失败' })
            console.log('我失败了');
          }
          /*
          没运行一次当前函数，说明有了一条folder数据，+1

          */
          mapAdd+=1
          console.log('ssssssssssssssssssssssssssssssssssssssssssssssssss',innerCont);
          if(JSON.stringify(innerCont.children) !== '[]'){
            mapAll += innerCont.children.length;
            innerCont.children.map(function(item,index){

              if(item.type == 'file'){
                /*
                如果是文件类型，不执行循环了，不涉及异步，+1
                */
                mapAdd+=1
                // Contents.remove({_id:item._id},function(err,result){
                //   if(err){
                //     return res.json({ success: false,resultsMsg:'删除失败' })
                //   }
                // })


                /*
                bug
                情况：最后一个文件夹中只有一个空文件 的时候，会导致不会进入循环，
                也就跳出了判断   JSON.stringify(innerCont.children) !== '[]'，
                只能在这里判断相等时进入下一个方法
                */
                req.folderDeleteArray.push(item._id)
                console.log('=======================空file情况我是总数============================',mapAll);
                console.log('=======================空file情况我是家属============================',mapAdd);
                if(mapAll+1 === mapAdd){
                  next()
                }
              }
              else{
                req.folderDeleteArray.push(item._id)
                getFolderId(item._id)
                // Contents.remove({_id:item._id},function(err,result){
                //   if(err){
                //     return res.json({ success: false,resultsMsg:'删除失败' })
                //   }
                // })
              }
            })
          }
          else{
            console.log('=======================我是总数============================',mapAll);
            console.log('=======================我是家属============================',mapAdd);
            if(mapAll+1 === mapAdd){
              next()
            }

          }



        })
        // next()
      }
      getFolderId(id)
      // console.log('*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*',req.folderDeleteArray);
      // return res.json({ success: false })
      /*
      上面这种奇葩写法，实在是 没有办法， 暂时测没有问题，目前就先这样，等以后有bug了在修改
      */
    }
}

/*
该方法用于清楚父亲中包含的子项id
*/
exports.deleteParentsObjectId = function(req,res,next){
    // console.log('*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*',req.folderDeleteArray);
    // console.log(req.folderDeleteArray.length);
    // return res.json({ success: false,resultsMsg:'查询失败',result:req.folderDeleteArray })
    var user = req.session.user;
    var id = req.body._id;
    var type = req.body.type;
    Contents.findById(id,user._id,function(err,innerCont){
      if(err){

        return res.json({ success: false,resultsMsg:'查询失败' })
      }
      if(innerCont){
          //第二部 删除本条数据父亲中的记录
          if(innerCont.parent){
            Contents.findParentItemsById(innerCont.parent._id,user._id,function(err,parentArray){
              if(err){
                return res.json({ success: false,resultsMsg:'删除失败' })
              }
              var newChildren = [];
              parentArray.children.map(function(item){
                console.log('++++++++++++++++++++++++++++++++++++++',id != item);
                if(id != item){
                  newChildren.push(item)
                }
              })
              parentArray.children = newChildren;
              parentArray.save(function(err,parentArrayss){
                if(err){
                  console.log(err);
                  return res.json({ error: true,msg:'删除失败'+err })
                }
                next()
              })
            })
          }
          else{
            next()
          }
      }
      else{
        return res.json({ success: false,resultsMsg:'查无此数据' })
      }

    })
}



/*
最后执行删除步骤，file直接删除，folder遍历数组删除
*/
exports.contentDelete = function(req,res){
    var id = req.body._id;
    var type = req.body.type;
    if(type === 'file'){
      //删除文章格式file
      //第一步删除 该条数据
      Contents.remove({_id:id},function(err,result){
        if(err){
          return res.json({ success: false,resultsMsg:'删除失败' })
        }
        return res.json({ success: true,resultsMsg:'删除成功' })
      })

    }
    else{
      //删除folder格式
      console.log(req.folderDeleteArray);

      Contents.remove({_id:{ $in:req.folderDeleteArray }},function(err,result){
        if(err){
          return res.json({ success: false,resultsMsg:'删除失败' })
        }
        return res.json({ success: true,resultsMsg:'删除成功' })
      })
    }
}

exports.packageFolderChangeShareArray = function(req,res,next){
		var user = req.session.user;
    var id = req.body._id;
    var type = req.body.type;
    var mapAll = 0;
    var mapAdd = 0;

    if(type=='file'){
      next();
    }
    else{
      req.folderShareArray = [id];
      var getFolderId = function(innerId){
        Contents.findById(innerId,user._id,function(err,innerCont){
          if(err){
            // return res.json({ success: false,resultsMsg:'查询失败' })
            console.log('我失败了');
          }
          /*
          	没运行一次当前函数，说明有了一条folder数据，+1
          */
          mapAdd+=1
          console.log('ssssssssssssssssssssssssssssssssssssssssssssssssss',innerCont);
          if(JSON.stringify(innerCont.children) !== '[]'){
            mapAll += innerCont.children.length;
            innerCont.children.map(function(item,index){

              if(item.type == 'file'){
                /*
                如果是文件类型，不执行循环了，不涉及异步，+1
                */
                mapAdd+=1
                /*
                bug
                情况：最后一个文件夹中只有一个空文件 的时候，会导致不会进入循环，
                也就跳出了判断   JSON.stringify(innerCont.children) !== '[]'，
                只能在这里判断相等时进入下一个方法
                */
                req.folderShareArray.push(item._id.toString())
                console.log('=======================空file情况我是总数============================',mapAll);
                console.log('=======================空file情况我是家属============================',mapAdd);
                if(mapAll+1 === mapAdd){
                  next()
                }
              }
              else{
                req.folderShareArray.push(item._id.toString())
                getFolderId(item._id)
              }
            })
          }
          else{
            console.log('=======================我是总数============================',mapAll);
            console.log('=======================我是家属============================',mapAdd);
            if(mapAll+1 === mapAdd){
              next()
            }

          }
        })
      }
      getFolderId(id)
      /*
      上面这种奇葩写法，实在是 没有办法， 暂时测没有问题，目前就先这样，等以后有bug了在修改
      */
    }
}
//change share
exports.contentsChangeShare = function(req,res){
		var user = req.session.user;
    var id = req.body._id;
    var type = req.body.type;
    if(type === 'file'){
    	Contents.findById(id,user._id,function(err,Contents_one){
        if(err){
          console.log(err);
        }
        if(Contents_one.share == 'false'){
        	Contents_one.share = 'true'
        	Contents_one.shareFirst = 'true'
        }
        else{
        	Contents_one.share = 'false'
        	Contents_one.shareFirst = 'false'
        }
        Contents_one.save(function(err,innerContN){
          if(err){
            console.log(err);
            return res.json({ error: true,msg:'更新失败'+err })
          }
          return res.json({ success: true,resultsMsg:'分享成功',share:innerContN.share })
        })
      })

    }
    else{

    	Contents.findById(id,user._id,function(err,Contents_one){
        if(err){
          console.log(err);
        }
        var judge = 'false';

        if(Contents_one.share == 'false'){
        	judge = 'true'
        	Contents_one.share = 'true'
        	Contents_one.shareFirst = 'true'
        }
        else{
        	judge = 'false'
        	Contents_one.share = 'false'
        	Contents_one.shareFirst = 'false'
        }
        Contents_one.save(function(err,innerContN){
          if(err){
            console.log(err);
            return res.json({ error: true,msg:'更新失败'+err })
          }
          req.folderShareArray.map(function(item,index){
	        	Contents.update({_id:item}, { $set: { share: judge }},function(err,result){
			        if(err){
			          return res.json({ success: false,resultsMsg:'查询失败' })
			        }
			        console.log(result)
			      })
	        	if(index == req.folderShareArray.length-1){
	        		return res.json({success:true,share:judge})
	        	}
	        })
        })

      })


    }
}
