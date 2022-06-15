const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
    origin: (origin: string, callback: Function) => {
        // checking to see if the origin is in allowedOrigins
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not Allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
};

module.exports = corsOptions;
export = corsOptions;
