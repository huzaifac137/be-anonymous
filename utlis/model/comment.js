import mongoose, { Schema, models } from "mongoose";

const commentSChema = new Schema({
  text: { type: String, required: true },
  creator: { type: String, required: true },
  creatorName: { type: String, required: true },
  belongsTo: { type: mongoose.Types.ObjectId, ref: "product", required: true },
});

const productModal = models.comment || mongoose.model("comment", commentSChema);

export default productModal;
