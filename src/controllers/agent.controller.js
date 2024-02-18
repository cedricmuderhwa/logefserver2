const { createAgent, findAgent, updateAgent, deleteAgent, findManyAgents } = require("../services/agent.service")


exports.createAgentHandler = async (req, res) => {
    const author = res.locals.user._id
    const region = res.locals.user.region
    const service = res.locals.user.service

    const body = req.body
    
    const agent  = await createAgent({ ...body, region, service, author})
    return res.json(agent)
}


exports.updateAgentHandler = async (req, res) => {
    const _id = req.params.agent_id
    const update = req.body

    const agent = await findAgent({ _id })

    if(!agent) return res.sendStatus(404)

    const updatedAgent = await updateAgent({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.json(updatedAgent)
}

exports.getAgentHandler = async (req, res) => {
    const _id = req.params.agent_id
    const region = res.locals.user.region;

    let agent = null;

    if(_id === '*') {
        agent = await findManyAgents({ region });
    } else {
        agent = await findAgent({ _id })
    }

    if(!agent) return res.sendStatus(404)

    return res.json(agent)
}

exports.deleteAgentHandler = async (req, res) => {
    const _id = req.params.agent_id

    const agent = await findAgent({ _id })

    if(!agent) return res.sendStatus(404)

    await deleteAgent({ _id })

    return res.send({ _id })
}

