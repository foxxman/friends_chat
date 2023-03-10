import express from "express";
import auth from "../middleware/auth.middleware.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
const router = express.Router({ mergeParams: true });
router.post("/", auth, async (req, res) => {
    try {
        if (!req.body.user || !req.body.roomname) {
            res.status(500).json({
                message: "Room creating issue",
            });
        }
        const { user, roomname } = req.body;
        const adminData = await User.findById(user);
        if (adminData) {
            const newRoom = await Room.create({
                admin: { _id: adminData._id, name: adminData.login },
                roomname,
                members: [adminData._id],
            });
            const newAdminData = { rooms: [...adminData.rooms, newRoom._id] };
            const updatedAdmin = await User.findByIdAndUpdate(adminData._id, newAdminData, {
                new: true,
            });
            res.status(201).send({ _id: newRoom._id, roomname: newRoom.roomname, updatedAt: newRoom.updatedAt });
        }
        else
            throw Error("user not found");
    }
    catch (error) {
        res.status(500).json({
            message: "Room creating issue",
        });
    }
});
router.get("/getRoomMembers/:roomId", auth, async (req, res) => {
    try {
        const { roomId } = req.params;
        const { user } = req.body;
        const room = await Room.findById(roomId);
        if (user && room && room.members.includes(user._id)) {
            const usersData = room.members.map((u) => {
                const userData = User.findById(u);
                return userData;
            });
            Promise.all(usersData).then((result) => {
                res.status(201).send({ users: result.filter((u) => u) });
            });
        }
        else {
            res.status(400).json({
                message: "Can't get room members list",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Something wrong, try later",
        });
    }
});
router.get("/getByRoomname/:roomName", auth, async (req, res) => {
    const { roomName } = req.params;
    const { user } = req.body;
    try {
        const userObj = await User.findById(user._id);
        if (userObj) {
            const userRoomsPromises = userObj.rooms.map(async (roomId) => {
                const room = await Room.findById(roomId);
                return room;
            });
            Promise.all(userRoomsPromises).then((results) => {
                const searchingRooms = results.filter((room) => room && room.roomname && room.roomname.toLowerCase().includes(roomName.toLowerCase()));
                res.status(201).send({ rooms: searchingRooms });
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Something wrong, try later",
        });
    }
});
router.get("/:roomId", auth, async (req, res) => {
    try {
        const { roomId } = req.params;
        const { user } = req.body;
        const room = await Room.findById(roomId);
        if (user && room && room.members.includes(user._id)) {
            res.send(room);
        }
        else {
            res.status(401).json({ message: "Unauthorized" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Something wrong, try later" });
    }
});
export default router;
//# sourceMappingURL=room.routes.js.map