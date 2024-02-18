const { object, string, number, array } = require('zod')

const payload = {
    body: object({

    }).optional()
}

const payloadUpdate = {
    body: object({
       
    }).optional()
}

const params = {
    params: object({
        service_id: string({
            required_error: 'service_id is required'
        })
    }).optional()
}

const query = {
    query : object({

    }).optional()
}

exports.createServiceSchema = object({ ...payload })

exports.updateServiceSchema = object({ ...payloadUpdate, ...params })

exports.readServiceSchema = object({ ...params })

exports.searchServiceSchema = object({ ...query })

exports.deleteServiceSchema = object({ ...params })


