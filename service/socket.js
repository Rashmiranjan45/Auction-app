import { Server } from "socket.io";
import Bid from "../models/bids.model.js";
import Item from "../models/items.model.js";
import Notification from "../models/notifications.model.js";

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("NEW CLIENT CONNECTED", socket.id);

    socket.on("bid", async ({ itemId, bidAmount, userId }) => {
      try {
        const bid = await Bid.create({
          item_id: itemId,
          user_id: userId,
          bidAmount,
        });
        const item = await Item.findByIdAndUpdate(
          itemId,
          {
            $set: { currentPrice: bidAmount },
            $push: { bids: bid._id },
          },
          { new: true }
        ).populate("owner");

        io.emit("update", { itemId, bidAmount });

        const notification = await Notification.create({
          user_id: item.owner._id,
          message: `New bid placed on your item: ${item.name}`,
        });

        console.log("Notification created", notification);

        if (item.owner._id.toString() !== userId) {
          io.to(item.owner._id.toString()).emit("notify", notification);
          console.log(`Notification emitted to ${item.owner._id}`);
        }
      } catch (error) {
        console.error("ERROR :: WHILE PLACING A BID :: ", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
};

export default socketHandler;
