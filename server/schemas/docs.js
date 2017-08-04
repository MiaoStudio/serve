var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var DocsSchema = new mongoose.Schema({
  name:{
    default:'',
    type:String,
  },
  path:{
    default:'',
    type:String,
    unique:true,
    required: true,
  },
  type:{
    default:'',
    type:String,
  },
  show_menu:{
    default:'false',
    type:String,
  },
  share:{
    default:'false',
    type:String,
  },
  intro:{
    default:'',
    type:String,
  },
  body:{
    default:'',
    type:String,
  },
  toc:{
    default:'Here are the TOC template, you can edit it by yourself↵↵- [Welcome](welcome)↵	- [How to write the document](how-to-write)↵- [About](about)↵',
    type:String,
  },
  parent:{
    default:'',
    type:String,
  },
  parentRef:{
    default:'',
    type:String,
  },
  meta:{
    createAt:{
      type:Date,
      default:Date.now()
    },
    updateAt:{
      type:Date,
      default:Date.now()
    }
  },
});
DocsSchema.pre('save',function(next){
  var user = this;
  if(this.isNew){
    this.meta.creatAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
});




DocsSchema.statics = {
  // fetch:function(editor_id,cb){
  //   return this
  //     .find({parent:null,editor:editor_id})
  //     .sort('meta.createAt')
  //     .populate('parent')
  //     .exec(cb)
  // },
  // findById:function(id,editor_id,cb){
  //   return this
  //     // .find({belongto:id})
  //     .findOne({_id:id,editor:editor_id})
  //     .populate('parent')
  //     .exec(cb)
  // },
  findByPath:function(path,cb){
    return this
      .findOne({path:path})
      .exec(cb)
  },
}
module.exports = DocsSchema
