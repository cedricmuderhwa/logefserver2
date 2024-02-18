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
        substance_id: string({
            required_error: 'substance_id is required'
        })
    }).optional()
}

const query = {
    query : object({

    }).optional()
}

exports.createSubstanceSchema = object({ ...payload })

exports.updateSubstanceSchema = object({ ...payloadUpdate, ...params })

exports.readSubstanceSchema = object({ ...params })

exports.searchSubstanceSchema = object({ ...query })

exports.deleteSubstanceSchema = object({ ...params })


