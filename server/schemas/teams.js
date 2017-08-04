var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var getRandomColor = function(){
  var color = '#'+Math.floor(Math.random()*16777215).toString(16);
  if(color.length==5){
    color = color + '0'
  }
  return color
}
var TeamsSchema = new mongoose.Schema({
  teamName:{
    // unique:true,
    // required: true,
    type:String,
  },
  path:{
    type:String,
    unique:true,
    required: true,
  },
  intro:{
    type:String,
  },
  avatar:{
    type:String,
    default:'',
  },
  avatar_color:{
    type:String,
    default:'',
  },
  teamMember:[
    {
      type:ObjectId,
      ref:'User'
    }
  ],
  teamOwner:{
    type:ObjectId,
    ref:'User'
  },
  // docs:[
  //   {
  //     type:ObjectId,
  //     ref:'Docs'
  //   }
  // ],
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

TeamsSchema.pre('save',function(next){
  var user = this;
  if(this.isNew){
    this.meta.creatAt = this.meta.updateAt = Date.now();
    this.avatar_color = getRandomColor()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
});

TeamsSchema.statics = {
  fetch:function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .populate('teamMember')
      .populate('teamOwner')
      .populate('docs')
      .exec(cb)
  },
  findById:function(id,cb){
    return this
      .findOne({_id:id})
      .populate('teamMember')
      .populate('teamOwner')
      .populate('docs')
      .exec(cb)
  },
  findByPath:function(path,cb){
    return this
      .findOne({path:path})
      .populate('teamMember')
      .populate('teamOwner')
      .populate('docs')
      .exec(cb)
  }
}
module.exports = TeamsSchema
