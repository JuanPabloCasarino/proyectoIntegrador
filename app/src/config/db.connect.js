import mongoose from 'mongoose';
import config from './config.js';
import log from './loggers/customLogger.js';

export default class MongoSingleton {
    static #instance;

    constructor() {
        mongoose.connect(config.mongoUrl);
    }

    static getInstance() {
        if(this.#instance) {
            log.debug('Already connected!');
            return this.#instance;
        }

        this.#instance = new MongoSingleton();
        log.debug(`Connected`);
        return this.#instance;        
    }
}