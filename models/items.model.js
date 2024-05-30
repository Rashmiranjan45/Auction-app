import mongoose,{Schema} from "mongoose";

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startingPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    default:function() {
      return this.startingPrice;
    }
  },
  imageUrl: {
    type: String,
  },
  endTime: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bids: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bid",
    },
  ],
});

const Item = mongoose.model("Item",itemSchema)

export default Item;