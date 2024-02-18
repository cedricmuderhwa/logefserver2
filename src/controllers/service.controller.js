const { createService, findService, updateService, deleteService, findManyServices } = require("../services/service.service")


exports.createServiceHandler = async (req, res) => {
    const author = res.locals.user._id
    const body = req.body
    
    const service  = await createService({ ...body, region: res.locals.user.region, author})
    res.json(service)
}


exports.updateServiceHandler = async (req, res) => {
    const _id = req.params.service_id
    const update = req.body

    const service = await findService({ _id })

    if(!service) return res.sendStatus(404)

    const updatedService = await updateService({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.json(updatedService)
}

exports.getServiceHandler = async (req, res) => {
    const _id = req.params.service_id
    const region = res.locals.user.region;
    
    let service = null;
    
    if(_id === '*') {
        service = await findManyServices({ region });
    } else {
        service = await findService({ _id })
    }

    if(!service) return res.sendStatus(404)

    return res.json(service)
}

exports.deleteServiceHandler = async (req, res) => {
    const _id = req.params.service_id

    const service = await findService({ _id })

    if(!service) return res.sendStatus(404)

    await deleteService({ _id })

    return res.send({ _id })
}

