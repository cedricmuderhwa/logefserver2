const { updateFraud } = require("../services/fraud.service")
const { createPvs, findPvs, updatePvs, deletePvs, findManyPvs, findPv } = require("../services/pvs.service")


exports.createPvsHandler = async (req, res) => {
    const author = res.locals.user._id
    const pv = res.locals.user.pv
    const region = res.locals.user.region

    const body = req.body

    const data = {
        ...body,
        pv, 
        region,
        author
    }
    
    const pvs  = await createPvs({ ...data })

    await updateFraud(
        { _id: body.fraud_id },
        { $addToSet: body.step === 'reception' ? {
            "reception.files" : pvs._id
        } : {
            "conclusion.files" : pvs._id
        }},
        {
            safe: true,
            upsert: true,
            new: true
        }
    )

    res.json(pvs)
}


exports.updatePvsHandler = async (req, res) => {
    const _id = req.params.pv_id
    const update = req.body

    const pvs = await findPvs({ _id })

    if(!pvs) return res.sendStatus(404)

    const updatedPvs = await updatePvs({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.json(updatedPvs)
}

exports.getPvsHandler = async (req, res) => {
    const _id = req.params.pv_id
    const region = res.locals.user.region;
    
    let pv = null;
    
    if(_id === '*') {
        pv = await findManyPvs({ region });
    } else {
        pv = await findPv({ _id })
    }

    if(!pv) return res.sendStatus(404)

    return res.json(pv)
}

exports.deletePvsHandler = async (req, res) => {
    const _id = req.params.pvs_id

    const pvs = await findPvs({ _id })

    if(!pvs) return res.sendStatus(404)

    await deletePvs({ _id })

    return res.send({ _id })
}

