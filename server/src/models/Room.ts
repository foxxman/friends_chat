import { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    _id: { type: Schema.Types.String },
    user: { _id: { type: Schema.Types.ObjectId, ref: "User" }, name: { type: Schema.Types.String } },
    text: { type: Schema.Types.String },
    room: { _id: { type: Schema.Types.ObjectId, ref: "Room" }, name: { type: Schema.Types.String } },
  },
  {
    //доб. 2 св-ва в модель: когда создана и когда обновлена
    timestamps: true,
  },
);

const schema = new Schema(
  {
    admin: { _id: { type: Schema.Types.ObjectId, ref: "User" }, name: { type: Schema.Types.String } },
    roomname: { type: Schema.Types.String },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [messageSchema],
  },
  {
    //доб. 2 св-ва в модель: когда создана и когда обновлена
    timestamps: true,
  },
);

export default model("Room", schema);
