var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ContentsSchema = new mongoose.Schema({
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
  share:{
    default:'false',
    type:String,
  },
  intro:{
    default:'',
    type:String,
  },
  parent:{
    type:ObjectId,
    ref:'User'
  },



  shareFirst:{
    default:'false',
    type:String,
  },
  content:{
    default:'',
    type:String,
  },
  children:[
    {
      type:ObjectId,
      ref:'Contents'
    }
  ],
  parents:[
    {
      type:ObjectId,
      ref:'Contents'
    }
  ],
  editor:{
    type:ObjectId,
    ref:'User'
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
ContentsSchema.pre('save',function(next){
  var user = this;
  if(this.isNew){
    this.meta.creatAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
});



// UserSchema.methods = {
//   comparePassword:function(_password,cb){
//     var isMatch = bcrypt.compareSync(_password, this.password);
//     cb(null, isMatch);
//   }
// }



ContentsSchema.statics = {
  fetch:function(editor_id,cb){
    return this
      .find({parent:null,editor:editor_id})
      .sort('meta.createAt')
      .populate('editor')
      .populate('parent')
      .populate('parents')
      .populate('children')
      .exec(cb)
  },
  findById:function(id,editor_id,cb){
    return this
      // .find({belongto:id})
      .findOne({_id:id,editor:editor_id})
      .populate('editor')
      .populate('parent')
      .populate('parents')
      .populate('children')
      .exec(cb)
  },
  findByIdPublic:function(id,cb){
    return this
      .findOne({_id:id})
      .populate('editor')
      .populate('parent')
      .populate('parents')
      .populate({
      	path: 'children',
				match: {share: 'true'}
      })
      .exec(cb)
  },
  fetchPublic:function(cb){
    return this
      .find({share:'true',shareFirst:'true'})
      .sort('meta.createAt')
      .populate('editor')
      .populate('parent')
      .populate('parents')
      .populate('children')
      .exec(cb)
  },
  findParentItemsById:function(id,editor_id,cb){
    return this
      // .find({belongto:id})
      .findOne({_id:id,editor:editor_id})
      .populate('editor')
      .populate('parent')
      .populate('parents')
      // .populate('children')
      .exec(cb)
  }
}
module.exports = ContentsSchema
