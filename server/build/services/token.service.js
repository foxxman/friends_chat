import jwt from "jsonwebtoken";
import Token from "../models/Token.js";
class TokenService {
    generate(payload) {
        if (!process.env.refreshSecret || !process.env.accessSecret)
            return null;
        const accessToken = jwt.sign(payload, process.env.accessSecret, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign(payload, process.env.refreshSecret);
        return { accessToken, refreshToken, expiresIn: 3600 };
    }
    async save({ userId, refreshToken }) {
        const data = await Token.findOne({ user: userId });
        if (data) {
            data.refreshToken = refreshToken;
            return data.save();
        }
        const token = await Token.create({ user: userId, refreshToken });
        return token;
    }
    async validateRefresh(refreshToken) {
        try {
            if (process.env.refreshSecret)
                return jwt.verify(refreshToken, process.env.refreshSecret);
            else
                return null;
        }
        catch (e) {
            return null;
        }
    }
    async validateAccess(accessToken) {
        if (!process.env.accessSecret)
            return null;
        try {
            return jwt.verify(accessToken, process.env.accessSecret);
        }
        catch (e) {
            return null;
        }
    }
    async findToken(refreshToken) {
        try {
            return await Token.findOne({ refreshToken });
        }
        catch (e) {
            return null;
        }
    }
}
export default new TokenService();
//# sourceMappingURL=token.service.js.map