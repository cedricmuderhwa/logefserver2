const { object, string, } = require('zod')

const payload = {
    body: object({
        start_date: string({
            required_error: 'start_date is required'
        }),
        end_date: string({
            required_error: 'end_date is required'
        })
    }).optional()
}

exports.filterSchema = object({ ...payload })



