const express = require('express');
const bodyParser = require('body-parser')

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain')
    next();
})
.get((req, res, next) => {
    res.end('retrieved all the leaders man')
})
.post((req, res, next) => {
    res.end('will add the leadership: '+ req.body.name + ' with details: '+req.body.description)
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders')
})
delete((req, res, next) => {
    res.end('deleting all the leaders')
});

module.exports = leaderRouter;