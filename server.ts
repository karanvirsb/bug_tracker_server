const express = require("express");
const app = express();
const port = 8000;

app.get("/", (req: Request, res: Response) => {
    console.log("/ request");
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});
