const logger = require('../utils/logger')

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        })
        next()
    } catch (e) {
        logger.error(e)
        return res.status(400).send(e.stack);
    }
}

module.exports = validate