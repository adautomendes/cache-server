const HttpStatus = require('http-status-codes');

const Building = require('../models/Building');
const Logger = require('../logger')('[BUILDING]');

module.exports = {
    async insert(req, res) {
        try {
            const { name, address } = req.body;

            //Testing if building already exists
            const buildingExists = await Building.findOne({ name });

            if (buildingExists) {
                Logger.print(`'${name}' already exists.`);
                return res.status(HttpStatus.OK).json(buildingExists);
            }

            const building = await Building.create({
                name,
                address
            });

            Logger.print(`'${name}' created!`);
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
                Logger.print(`'${name}' updated!`);
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
            let buildings;

            if (id) { //Find one
                buildings = await Building.findById(id);
                Logger.print(`Building '${buildings.title}' found!`);
            } else { //Find all
                buildings = await Building.find();
                Logger.print(`${buildings.length} buildings found!`);
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
                    Logger.print(`'${building.name}' removed!`);
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