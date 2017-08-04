var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var DocsSchema = new mongoose.Schema({
  name:{
    default:'',
    type:String,
  },
  en_name:{
    type:String,
    unique:true,
    required: true,
  },
  intro:{
    default:'',
    type:String,
  },
  //团队
  teamlist:[
    {
      type:ObjectId,
      ref:'Teams'
    }
  ],
  //仓库
  doclist:[
    {
      type:ObjectId,
      ref:'Docs'
    }
  ],
  //具体文档，只有头条主干用到
  articlelist:[
    {
      type:ObjectId,
      ref:'Article',
    }
  ],
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
  findByPath:function(en_name,cb){
    return this
      .findOne({en_name:en_name})
      .populate(['teamlist','doclist','articlelist'])
      .exec(cb)
  },
  fetch:function(cb){
    return this
      .find({})
      // .populate(['teamlist','doclist'])
      .populate(['teamlist','doclist','articlelist'])
      .exec(cb)
  },
}
module.exports = DocsSchema
