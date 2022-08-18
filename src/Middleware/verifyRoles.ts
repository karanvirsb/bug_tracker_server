import { NextFunction, Request, Response } from "express";

const verifyRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!(req as any)?.roles) return res.sendStatus(401); // even if we have req it must have roles
        const rolesArray = [...allowedRoles];

        // mapping over the roles sent from the jwt and comparing them getting true and false
        // then we want ot find the first true
        const result = (req as any).roles
            .map((role: string) => rolesArray.includes(role))
            .find((val: boolean) => val === true); // includes checks if its in the array, all we need is one true
        if (!result) return res.sendStatus(401);
        next();
    };
};

export default verifyRoles;
