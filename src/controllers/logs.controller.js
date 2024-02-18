const { createLog, findLog, updateLog, deleteLog, findManyLogs } = require("../services/log.service")


exports.createLogHandler = async (req, res) => {
    const author = res.locals.user._id
    const region = res.locals.user.region
    const service = res.locals.user.service

    const body = req.body
    
    const log  = await createLog({ ...body, region, service, author})
    return res.json(log)
}


exports.updateLogHandler = async (req, res) => {
    const _id = req.params.log_id
    const update = req.body

    const log = await findLog({ _id })

    if(!log) return res.sendStatus(404)

    const updatedLog = await updateLog({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.json(updatedLog)
}

exports.getLogHandler = async (req, res) => {
    const _id = req.params.log_id
    const region = res.locals.user.region;

    let log = null;

    if(_id === '*') {
        log = await findManyLogs({ region });
    } else {
        log = await findLog({ _id })
    }

    if(!log) return res.sendStatus(404)

    return res.json(log)
}

exports.deleteLogHandler = async (req, res) => {
    const _id = req.params.log_id

    const log = await findLog({ _id })

    if(!log) return res.sendStatus(404)

    await deleteLog({ _id })

    return res.send({ _id })
}

