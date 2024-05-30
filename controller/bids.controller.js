import Bid from "../models/bids.model.js";
import Item from "../models/items.model.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const createBid = async(req,res) => {
    try {
        const {bidAmount} = req.body;
        const item_id = req.params.itemId
        const user_id = req.user._id
        const item = await Item.findById(item_id)
        if (!item) {
            throw new ApiError(404,"Item does not found")
        }
        const existingBid = await Bid.findOne({ item_id, user_id });
        if (existingBid) {
          throw new ApiError(400, "User already placed a bid for this item");
        }

        const bid = await Bid.create({
            bidAmount,
            user_id,
            item_id
        })
        if (!bid) {
            throw new ApiError(500,"Bid is not created")
        }

        if (bid.bidAmount > item.currentPrice) {
          await Item.findByIdAndUpdate(item_id, {
            $set: { currentPrice: bid.bidAmount, bids: bid._id },
          });
        }

        if (item.endTime < Date.now()) {
          console.log(`Auction for item ${item.name} has ended. Winner: ${bid.user_id}`);
          // Implement logic to send notifications to participants (e.g., email, push notifications)
        }

        return res
        .status(201)
        .json(new ApiResponse(201,bid,"Bid created successfully"))
    } catch (error) {
        console.log("ERROR :: WHILE CREATING A BID :: ",error)
    }
}

const retrieveBid = async(req,res) => {
    try {
        const itemId = req.params.itemId
        const bids = await Bid.find({item_id:itemId})
        console.log(itemId)
        if (!bids) {
            throw new ApiError(505,"Something went wrong while fetching bids")
        }
        console.log(bids);
        return res
          .status(200)
          .json(new ApiResponse(200, bids, "Feched bids for item"));
    } catch (error) {
        console.log("ERROR :: WHILE RETRIEVING ALL BID :: ", error);
    }
}


export { createBid, retrieveBid };
