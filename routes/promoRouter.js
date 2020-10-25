const express = require('express');
const bodyParser = require('body-parser')

const promoRouter = express.Router();

promoRouter.use(bodyParser.json())

promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain')
    next();
})
.get((req, res, next) => {
    res.end('retrieved all the promotions man')
})
.post((req, res, next) => {
    res.end('will add the promotion: '+ req.body.name + ' with details: '+req.body.description)
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions')
})
delete((req, res, next) => {
    res.end('deleting all the promotions')
});

module.exports = promoRouter;