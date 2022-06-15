export = {};
const allowedOrigins = require("../Config/allowedOrigins");

const credentials = (req: Request, res: Response, next: Function) => {
    const origin = req.headers.get("origin") || "";
    if (allowedOrigins.includes(origin)) {
        res.headers.set("Access-Control-Allow-Credentials", "true");
    }
    next();
};

module.exports = credentials;
