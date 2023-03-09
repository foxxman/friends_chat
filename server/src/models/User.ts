import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    login: { type: String },
    password: { type: String },
    rooms: [{ type: Schema.Types.ObjectId, ref: "Desk" }],
    // membership: [{ type: Schema.Types.ObjectId, ref: "Desk" }],
    //type - id объекта из  ref: User
    //оборачиваем в [], т.к. массив
    // subscribers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // rate: Number,
  },
  {
    //доб. 2 св-ва в модель: когда создана и когда обновлена
    timestamps: true,
  },
);

export default model("User", schema);
