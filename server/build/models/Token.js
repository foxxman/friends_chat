import { Schema, model } from "mongoose";
const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    refreshToken: { type: String, required: true },
}, {
    timestamps: true,
});
export default model("Token", schema);
//# sourceMappingURL=Token.js.map