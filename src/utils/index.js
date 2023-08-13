const { Config } = require('./config');
const { HttpStatusCode, 
    ResponseStatus } = require('./responseCodes');
const {
    createHash,
    compareHash
} = require('./encryption');
const {
    GenerateOtp,
    generateTransactionRef
} = require('./string');


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXP = process.env.JWT_EXP;


module.exports = {
    Config,
    HttpStatusCode,
    ResponseStatus,
    createHash,
    compareHash,
    GenerateOtp,
    generateTransactionRef,
    JWT_SECRET,
    JWT_EXP,
}
