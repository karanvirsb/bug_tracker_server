import { nanoid } from "nanoid/async";

const generate = async (): Promise<string> => {
    return await nanoid();
};

export default generate;
