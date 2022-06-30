import cors from "cors";
import allowedOrigins from "./allowedOrigins";

const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
};

export default corsOptions;
