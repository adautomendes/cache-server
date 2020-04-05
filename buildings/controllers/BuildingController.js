const HttpStatus = require('http-status-codes');

const Building = require('../models/Building');
const CacheService = require('../service/CacheService');
const Log = require('../log')('[BUILDING]');

module.exports = {
    async insert(req, res) {
        try {
            const { name, address } = req.body;

            //Testing if building already exists
            const buildingExists = await Building.findOne({ name });

            if (buildingExists) {
                Log.print(`'${name}' already exists.`);
                return res.status(HttpStatus.OK).json(buildingExists);
            }

            const building = await Building.create({
                name,
                address
            });

            Log.print(`'${name}' created!`);

            CacheService.clearCache();

            return res.status(HttpStatus.CREATED).json(building);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                error
            });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, address } = req.body;

            const response = await Building.updateOne({ _id: id }, {
                name,
                address
            });

            if (response.nModified == 1 && response.ok == 1) {
                Log.print(`'${name}' updated!`);
                const building = await Building.findById(id);
                return res.status(HttpStatus.OK).json(building);
            }
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                error
            });
        }
    },

    async search(req, res) {
        try {
            const { id } = req.params;
            const { idOnly } = req.query;
            let buildings = [];

            if (id) { //Find one
                buildings = await Building.findById(id);
                Log.print(`Building '${buildings.title}' found!`);
            } else if (idOnly && idOnly == 'true') {
                idList = await Building.find().select({ _id: 1 });

                for (const buildingId of idList) {
                    buildings.push(buildingId._id);
                }

                Log.print(`${buildings.length} buildings found!`);
            } else { //Find all
                buildings = await Building.find();
                Log.print(`${buildings.length} buildings found!`);
            }

            return res.status(HttpStatus.OK).json(buildings);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                error
            });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;

            const building = await Building.findById(id);

            if (building) {
                const response = await Building.deleteOne({ _id: id });

                if (response.deletedCount == 1 && response.ok == 1) {
                    Log.print(`'${building.name}' removed!`);

                    CacheService.clearCache();

                    return res.status(HttpStatus.OK).json({
                        response
                    });
                }
            } else {
                return res.status(HttpStatus.NOT_FOUND).json({
                    status: HttpStatus.NOT_FOUND,
                    error: `Building with '${id}' was not found`
                });
            }
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                error
            });
        }
    }
};