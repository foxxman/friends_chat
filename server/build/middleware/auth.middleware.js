import tokenService from "../services/token.service.js";
export default async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
        }
        else {
            const data = await tokenService.validateAccess(token);
            if (!data) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.body.user = data;
            next();
        }
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
//# sourceMappingURL=auth.middleware.js.map