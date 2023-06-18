import mongoose from "mongoose";


const CommentSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }, {
    timestamps: true,
  });



const PostShema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type:Number,
        default:0
    },
    comments: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        text: {
          type: String,
          required: true
        }
      }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    imageUrl: String,
}, {
    timestamps: true,
});

export default mongoose.model('Post', PostShema);