import { validateToken } from "../utils/validation.utils.js";
import log from "../config/loggers/customLogger.js";

const isUserOrTokenValid = (req, res, next) => {
    if(req.user) {
        return next();
    }

    const authorizedToken = req.headers.authorization;
    log.info(authorizedToken)
    const checkToken = validateToken(authorizedToken);

    if(checkToken) {
        return next();
    }

    return res.status(401).send("No autorizado!");
}

export {
    isUserOrTokenValid
}