import mongoose from "mongoose";

const strToObjId = (str: string) => new mongoose.Types.ObjectId(str);

export default strToObjId;
