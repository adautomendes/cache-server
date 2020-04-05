const HttpStatus = require('http-status-codes');
const CacheService = require('../service/CacheService');

const Block = require('../models/Block');
const Logger = require('../log')('[BLOCK]');

module.exports = {
    async insert(req, res) {
        try {
            const { number, building_id } = req.body;

            //Testing if block already exists
            const blockExists = await Block.findOne({ number, building_id });

            if (blockExists) {
                Logger.print(`'${number}' already exists.`);
                return res.status(HttpStatus.OK).json(blockExists);
            }

            //Check if building exists
            if (CacheService.getCache().indexOf(building_id) > -1) {
                const block = await Block.create({
                    number,
                    building_id
                });

                Logger.print(`'${number}' created!`);
                return res.status(HttpStatus.CREATED).json(block);
            } else {
                return res.status(HttpStatus.FORBIDDEN).json({
                    status: HttpStatus.FORBIDDEN,
                    error: `Building with id=${building_id} does not exists`
                });
            }
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
            const { number } = req.body;

            const response = await Block.updateOne({ _id: id }, {
                number
            });

            if (response.nModified == 1 && response.ok == 1) {
                Logger.print(`'${number}' updated!`);
                const block = await Block.findById(id);
                return res.status(HttpStatus.OK).json(block);
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
            let blocks = [];

            if (id) { //Find one
                blocks = await Block.findById(id);
                Logger.print(`Block '${blocks.title}' found!`);
            } else { //Find all
                blocks = await Block.find();
                Logger.print(`${blocks.length} blocks found!`);
            }

            return res.status(HttpStatus.OK).json(blocks);
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

            const block = await Block.findById(id);

            if (block) {
                const response = await Block.deleteOne({ _id: id });

                if (response.deletedCount == 1 && response.ok == 1) {
                    Logger.print(`'${block.number}' removed!`);
                    return res.status(HttpStatus.OK).json({
                        response
                    });
                }
            } else {
                return res.status(HttpStatus.NOT_FOUND).json({
                    status: HttpStatus.NOT_FOUND,
                    error: `Block with '${id}' was not found`
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