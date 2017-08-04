var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');
var bcrypt = require('bcrypt-nodejs')
const saltRounds = 10;
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var getRandomColor = function(){
  var color = '#'+Math.floor(Math.random()*16777215).toString(16);
  if(color.length==5){
    color = color + '0'
  }
  return color
}
var UserSchema = new mongoose.Schema({
  name:{
    // unique:true,
    // required: true,
    type:String,
  },
  email:{
    type:String,
    unique:true,
    required: true,
  },
  password:{
    type:String,
    required: true,
  },
  role:{
    type:Number,
    default:0,
  },
  avatar:{
    type:String,
    default:'',
  },
  avatar_color:{
    type:String,
    default:'',
  },
  gender:{
    type:String,
    default:'非男非女',
  },
  //绰号？
  faction:{
    type:String,
    default:'',
  },
  //头衔
  title:{
    type:String,
    default:'初来乍到',
  },
  phone:{
    type:String,
    default:'110',
  },
  job:{
    type:String,
    default:'	JAVA工程师',
  },
  location:{
    type:String,
    default:'浙江,杭州,德力西',
  },
  // teamOwn:[
  //   {
  //     type:ObjectId,
  //     ref:'Teams'
  //   }
  // ],
  teamBelong:[
    {
      type:ObjectId,
      ref:'Teams'
    }
  ],
  apartment:{
    type:String,
    default:'仁聚汇通,杭州事业部,技术部',
  },
  birth:{
    type:Object,
    default:{},
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
UserSchema.pre('save',function(next){
  var user = this;
  if(this.isNew){
    this.meta.creatAt = this.meta.updateAt = Date.now();

    this.avatar_color = getRandomColor()
    var hash = bcrypt.hashSync(this.password,bcrypt.genSaltSync(10));
    this.password = hash;

  } else {
    this.meta.updateAt = Date.now()
  }

  next()
});



UserSchema.methods = {
  comparePassword:function(_password,cb){
    var isMatch = bcrypt.compareSync(_password, this.password);
    cb(null, isMatch);
    // bcrypt.compare(_password,this.password,function(err,isMatch){
    //   if(err){
    //     return cb(err)
    //   }
    //   cb(null,isMatch)
    // })
  }
}



UserSchema.statics = {
  fetch:function(cb){
    return this
      .find({})
      .populate('teamBelong')
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById:function(id,cb){
    return this
      .findOne({_id:id})
      .populate('teamBelong')
      .exec(cb)
  },
  findByIdShared:function(id,cb){
    return this
      .findOne({_id:id})
      .populate('teamBelong')
      .exec(cb)
  },
}
module.exports = UserSchema
