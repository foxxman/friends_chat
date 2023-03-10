import { Schema, model } from "mongoose";
const figureSchema = new Schema({
    type: { type: Schema.Types.String },
    x: { type: Schema.Types.Number },
    y: { type: Schema.Types.Number },
    width: { type: Schema.Types.String },
    height: { type: Schema.Types.String },
    color: { type: Schema.Types.String },
    strokeColor: { type: Schema.Types.String },
});
const messageSchema = new Schema({
    deskId: { type: Schema.Types.ObjectId, ref: "Desk", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    method: { type: Schema.Types.String, required: true },
    date: { type: Schema.Types.Number },
    figure: {
        type: { type: Schema.Types.String },
        x: { type: Schema.Types.Number },
        y: { type: Schema.Types.Number },
        width: { type: Schema.Types.String },
        height: { type: Schema.Types.String },
        color: { type: Schema.Types.String },
        strokeColor: { type: Schema.Types.String },
    },
}, {
    timestamps: false,
});
const schema = new Schema({
    admin: { _id: { type: Schema.Types.ObjectId, ref: "User" }, name: { type: Schema.Types.String } },
    deskname: { type: Schema.Types.String },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    actions: [messageSchema],
}, {
    timestamps: true,
});
export default model("Desk", schema);
//# sourceMappingURL=Desk.js.map