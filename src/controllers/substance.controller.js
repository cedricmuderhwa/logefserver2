const { updateFraud } = require("../services/fraud.service")
const { createSubstance, findSubstance, updateSubstance, deleteSubstance, findManySubstances } = require("../services/substance.service")


exports.createSubstanceHandler = async (req, res) => {
    const author = res.locals.user._id
    const body = req.body
    const region = res.locals.user.region
    
    const substance  = await createSubstance({ ...body, region, author})

    await updateFraud(
        {_id: body.fraud_id},
        {$addToSet: {
            "reception.substances": substance._id
        }},
        {
            safe: true,
            upsert: true,
            new: true
        }
    )

    res.json(substance)
}


exports.updateSubstanceHandler = async (req, res) => {
    const _id = req.params.substance_id
    const update = req.body

    const substance = await findSubstance({ _id })

    if(!substance) return res.sendStatus(404)

    const updatedSubstance = await updateSubstance({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.json(updatedSubstance)
}

exports.getSubstanceHandler = async (req, res) => {
    const _id = req.params.substance_id
    const region = res.locals.user.region;

    let substance = null;
    
    if(_id === '*') {
        substance = await findManySubstances({ region });
    } else {
        substance = await findSubstance({ _id })
    }

    if(!substance) return res.sendStatus(404)

    return res.json(substance)
}

exports.deleteSubstanceHandler = async (req, res) => {
    const _id = req.params.substance_id

    const substance = await findSubstance({ _id })

    if(!substance) return res.sendStatus(404)

    await deleteSubstance({ _id })

    return res.send({ _id })
}

