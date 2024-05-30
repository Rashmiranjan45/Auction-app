import mongoose,{Schema} from "mongoose";

const notificationSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Notification = mongoose.model("Notification",notificationSchema)

export default Notification