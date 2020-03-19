const express = require('express');
const bodyParser = require('body-parser')

const leadershipRouter = express.Router();

leadershipRouter.use(bodyParser.json())

leadershipRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain')
    next();
})
.get((req, res, next) => {
    res.end('retrieved all the leaderships man')
})
.post((req, res, next) => {
    res.end('will add the leadership: '+ req.body.name + ' with details: '+req.body.description)
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaderships')
})
delete((req, res, next) => {
    res.end('deleting all the leaderships')
});

module.exports = leadershipRouter;