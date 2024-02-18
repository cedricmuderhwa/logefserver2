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
        user_id: string({
            required_error: 'user_id is required'
        })
    }).optional()
}

const query = {
    query : object({

    }).optional()
}

exports.createUserSchema = object({ ...payload })

exports.updateUserSchema = object({ ...payloadUpdate, ...params })

exports.readUserSchema = object({ ...params })

exports.searchUserSchema = object({ ...query })

exports.deleteUserSchema = object({ ...params })


