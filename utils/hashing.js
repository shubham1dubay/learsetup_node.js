const { createHmac } = require("crypto");
const bcrypt = require("bcryptjs");

exports.doHash = async (value, saltValue) => {
    return await bcrypt.hash(value, saltValue);
};

exports.doHashValidation = async (value, hashedValue) => {
    return await bcrypt.compare(value, hashedValue);
};

exports.hmacProcess = (value, key) => {
    const result = createHmac("sha256", key)
        .update(value)
        .digest("hex");
    return result;
};
