var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ArticleSchema = new mongoose.Schema({
  body:{
    default:'',
    type:String,
  },
  title:{
    default:'New document',
    type:String,
  },
  doc_id:{
    type:ObjectId,
    required: true,
    ref:'Docs'
  },
  author:{
    type:ObjectId,
    ref:'User'
  },
  format:{
    default:'markdown',
    type:String,
  },
  public:{
    default:1, //1公开，0私密
    type:Number,
  },
  status:{
    default:0, //0草稿未发布，1已经发布
    type:Number,
  },
  //预留两条信息，为popular使用
  cover:{
    default:'http://cn.bing.com/az/hprichbg/rb/Nyala_ZH-CN13349334824_1920x1080.jpg',
    type:String,
  },
  intro:{
    default:'未添加介绍，请补充',
    type:String,
  },
  slurm:{
    default:'',
    type:String,
    unique:true,
    required: true,
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
ArticleSchema.pre('save',function(next){
  var user = this;
  if(this.isNew){
    this.meta.creatAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
});




ArticleSchema.statics = {
  findBySlurm:function(slurm,cb){
    return this
      .findOne({slurm:slurm})
      .populate(['doc_id','author'])
      .exec(cb)
  },
}
module.exports = ArticleSchema
