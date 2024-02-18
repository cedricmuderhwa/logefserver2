const { createContainer, findContainer, updateContainer, deleteContainer, findManyContainers } = require("../services/container.service")


exports.createContainerHandler = async (req, res) => {
    const author = res.locals.user._id
    const region = res.locals.user.region
    const body = req.body
    
    const container  = await createContainer({ ...body, region, author})
    return res.json(container)
}


exports.updateContainerHandler = async (req, res) => {
    const _id = req.params.container_id
    const update = req.body

    const container = await findContainer({ _id })

    if(!container) return res.sendStatus(404)

    const updatedContainer = await updateContainer({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.json(updatedContainer)
}

exports.getContainerHandler = async (req, res) => {
    const _id = req.params.container_id
    const region = res.locals.user.region

    let container = null;
    
    if(_id === '*') {
        container = await findManyContainers({ region })
    } else {
        container = await findContainer({ _id })
    }

    if(!container) return res.sendStatus(404)

    return res.json(container)
}

exports.deleteContainerHandler = async (req, res) => {
    const _id = req.params.container_id

    const container = await findContainer({ _id })

    if(!container) return res.sendStatus(404)

    await deleteContainer({ _id })

    return res.send({ _id })
}

