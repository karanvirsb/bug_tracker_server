import { nanoid } from "nanoid/async";

const generate = async (): Promise<string> => {
    return nanoid();
};

export default generate;
