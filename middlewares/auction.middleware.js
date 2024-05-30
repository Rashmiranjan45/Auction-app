import Item from "../models/items.model.js";

export const checkAuctionEnd = async(req,res,next) => {
    try {
        const itemId = req.params.itemId;
        const item = await Item.findById(itemId);
        if (!item) {
            throw new ApiError(404, "Item not found");
        }

        if (item.endTime < Date.now()) {
      // Auction has ended
            throw new ApiError(400, "Auction has already ended");
        }
        next(); // Continue with the request if auction is still open
    } catch (error) {
        next(error)
    }
}
