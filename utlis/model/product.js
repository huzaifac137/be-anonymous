import mongoose, { Schema, models } from "mongoose";

const productSChema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: String, required: true },
  creatorName: { type: String, required: true },
  upvotes: [{ type: String, required: true }],
  downvotes: [{ type: String, required: true }],
});

const productModal = models.product || mongoose.model("product", productSChema);

export default productModal;
