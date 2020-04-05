const HttpStatus = require('http-status-codes');
const axios = require("axios");
require('dotenv').config();

const Log = require('../log')('[BUILDING_CACHE_SERVICE]');

const BUILDING_URL = `http://${process.env.BUILDING_SERVER}:${process.env.BUILDING_PORT}/building?idOnly=true`

var buildingCache = [];

module.exports = {
    getCache() {
        if (buildingCache.length <= 0) {
            Log.printRequest('GET', BUILDING_URL);

            axios.get(BUILDING_URL)
                .then((response) => {
                    buildingCache = response.data;
                    Log.print(`Cache refreshed at ${new Date()}`);
                })
                .catch((error) => {
                    Log.printError(`Error on cache hit => ${error}`);
                });
        }

        return buildingCache;
    },

    clearCache(req, res) {
        buildingCache = [];

        module.exports.getCache();

        return res.status(HttpStatus.OK).json({
            msg: `Cache cleared!`
        })
    }
}