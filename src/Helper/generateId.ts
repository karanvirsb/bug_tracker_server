import { nanoid } from "nanoid/async";

const generate = async () => {
    return await nanoid();
};

export default generate;
