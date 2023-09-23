import businessService from '../services/businesServices.js';
import log from '../config/loggers/customLogger.js';
const business = new businessService();

const getAllBusiness = async (req, res) => {
    const result = await business.getAll();
    res.status(200).send(result);
};

const getBusinessById = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        if (!id) {
            return res.status(400).send("Id es mandatorio!");
        }
        const result = await business.getBusinessById(id);
        res.status(200).send(result);

    } catch (error) {
        log.error(error);
        res.status(500).json({error: error.message});
    }
}

const insertBusiness = async (req, res) => {
    try {
        const result = await business.create(req.body);
        res.status(200).send(result);
    } catch (error) {
        log.error(error);
        res.status(500).json({error: error.message});
    }
}

const addBusinessProduct = async (req, res) => {
    const {
        id
    } = req.params;
    if (!id) {
        return res.status(400).send("Id es mandatorio");
    }

    try {
        const product = req.body;
        const result = await business.updateBusinessProduct(id, product);
        res.status(200).send(result);
    } catch (error) {
        log.error(error);
        res.status(500).json({error: error.message});
    }
}

export {
    getAllBusiness,
    getBusinessById,
    insertBusiness,
    addBusinessProduct
}