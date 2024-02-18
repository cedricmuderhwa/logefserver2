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
        region_id: string({
            required_error: 'region_id is required'
        })
    }).optional()
}

const query = {
    query : object({

    }).optional()
}

exports.createRegionSchema = object({ ...payload })

exports.updateRegionSchema = object({ ...payloadUpdate, ...params })

exports.readRegionSchema = object({ ...params })

exports.searchRegionSchema = object({ ...query })

exports.deleteRegionSchema = object({ ...params })


