import Notification from "../models/notifications.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getNotification = async(req,res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({user_id:userId})

        if (!notifications) {
            throw new ApiError(404,"Notification was not found .")
        }
    
        return res
        .status(201)
        .json(new ApiResponse(201,"Notification generated successfully."))

    } catch (error) {
        console.log("ERROR :: WHILE CREATING A NOTIFICATION ::",error)
    }
}

const markNotificationAsRead = async(req,res) => {
    try {
        const userId = req.user._id;
        const notification = await Notification.updateMany({user_id:userId,isRead:false},{isRead:true})

        if (!notification) {
            throw new ApiError(505,"Something went wrong please wait a while !")
        }
        return res
        .status(200)
        .json(new ApiResponse(200,{},"Notification marked as read ."))
    } catch (error) {
        console.log("ERROR :: WHILE MARKING AS READ THE NOTIFICATION :: ",error)
    }
}


export { getNotification, markNotificationAsRead };