import mongoose from 'mongoose';

export interface IPost {
  title: string;
  contents: string;
}

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  //   fileUrl: { type: String },
  contents: { type: String, trim: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  //   hashTag: [{ type: String, trim: true }],
  //   mata: { view: { type: Number, default: 0 } },
  //   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  //   owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
