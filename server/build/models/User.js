import { model, Schema } from "mongoose";
const schema = new Schema({
    login: { type: String },
    password: { type: String },
    rooms: [{ type: Schema.Types.ObjectId, ref: "Desk" }],
}, {
    timestamps: true,
});
export default model("User", schema);
//# sourceMappingURL=User.js.map