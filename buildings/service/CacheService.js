const axios = require("axios");
require('dotenv').config();

const Log = require('../log')('[BLOCK_CACHE_SERVICE]');

const BLOCK_URL = `http://${process.env.BLOCK_SERVER}:${process.env.BLOCK_PORT}/cache`

module.exports = {
    async clearCache() {
        axios.delete(BLOCK_URL)
            .then((response) => {
                Log.print(`Cache cleared => ${JSON.stringify(response.data)}`)
            })
            .catch((error) => {
                Log.printError(`Error on clear cache => ${error}`);
            });
    }
}