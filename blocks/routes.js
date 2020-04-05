const express = require('express');
const appRouter = express.Router();

const BlockController = require('./controllers/BlockController');

const blockRouter = express.Router();

appRouter.get('/', (req, res) => { //Root route of app
    res.json({ ok: true })
});

appRouter.use('/block', blockRouter);
blockRouter.post('/', BlockController.insert);
blockRouter.patch('/:id', BlockController.update);
blockRouter.get('/:id?', BlockController.search);
blockRouter.delete('/:id', BlockController.delete);

module.exports = appRouter;