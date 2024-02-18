const { createRegion, findRegion, updateRegion, deleteRegion, findManyRegions } = require("../services/region.service");
const { createStat } = require("../services/stat.service");


exports.createRegionHandler = async (req, res) => {
    const author = res.locals?.user?._id || undefined;
    const body = req.body
    
    try {
        const region  = await createRegion({ ...body, author})
        await createStat({ region: region._id })
        return res.json(region)
    } catch (error) {
        return res.status(409).json({
            error: 409,
            message: "[Conflict]: '"+ body.region +"' region already exist "
        })
    }
    
}


exports.updateRegionHandler = async (req, res) => {
    const _id = req.params.region_id
    const update = req.body

    const region = await findRegion({ _id })

    if(!region) return res.sendStatus(404)

    const updatedRegion = await updateRegion({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.json(updatedRegion)
}

exports.getRegionHandler = async (req, res) => {
    const _id = req.params.region_id
    
    let region = null;
    
    if(_id === '*') {
        region = await findManyRegions({})
    } else {
        region = await findRegion({ _id })
    }

    if(!region) return res.sendStatus(404)

    return res.json(region)
}

exports.deleteRegionHandler = async (req, res) => {
    const _id = req.params.region_id

    const region = await findRegion({ _id })

    if(!region) return res.sendStatus(404)

    await deleteRegion({ _id })

    return res.send({ _id })
}

