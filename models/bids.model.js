import mongoose,{Schema} from "mongoose";

const bidSchema = new Schema({
    item_id:{
        type:Schema.Types.ObjectId,
        ref:"Item",
        required:true
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    bidAmount:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

bidSchema.index({ item_id: 1, user_id: 1 }, { unique: true });

const Bid = mongoose.model("Bid",bidSchema)

export default Bid