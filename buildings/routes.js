const express = require('express');
const appRouter = express.Router();

const BuildingController = require('./controllers/BuildingController');

const buildingRouter = express.Router();

appRouter.get('/', (req, res) => { //Root route of app
    res.json({ ok: true })
});

appRouter.use('/building', buildingRouter);
buildingRouter.post('/', BuildingController.insert);
buildingRouter.patch('/:id', BuildingController.update);
buildingRouter.get('/:id?', BuildingController.search);
buildingRouter.delete('/:id', BuildingController.delete);

module.exports = appRouter;