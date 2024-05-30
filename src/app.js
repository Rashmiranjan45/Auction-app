import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import userRouter from "../routes/users.routes.js";
import itemRouter from "../routes/items.routes.js";
import bidsRouter from "../routes/bids.routes.js";
import notificationRouter from "../routes/notifications.routes.js";
import socketHandler from "../service/socket.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(
  express.static(path.resolve("./public"), {
    index: ["index.html"],
    setHeaders: (res, path) => {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    },
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/item", itemRouter);
app.use("/api/v1/bids", bidsRouter);
app.use("/api/v1/notify", notificationRouter);

socketHandler(server);

export { app, server };
