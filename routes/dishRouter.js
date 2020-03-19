const express = require('express');
const bodyParser = require('body-parser')

const dishRouter = express.Router();

dishRouter.use(bodyParser.json())

dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain')
    next();
})
.get((req, res, next) => {
    res.end('retrieved all the dishes man')
})
.post((req, res, next) => {
    res.end('will add the dish: '+ req.body.name + ' with details: '+req.body.description)
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes')
})
delete((req, res, next) => {
    res.end('deleting all the dishes')
});

module.exports = dishRouter;

// .get('/dishes/:dishId', (req, res, next) => {
//     res.end('will send details of the dish: '+req.params.dishId+' to you')
// })
// .post('/dishes/:dishId', (req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /dishes/'+req.params.dishId)
// })
// .put('/dishes/:dishId', (req, res, next) => {
//     res.write('updating the dish: '+req.params.dishId)
//     res.end('will update the dish: '+ req.body.name + ' with details: '+req.body.description)
// })
// .delete('/dishes/:dishId', (req, res, next) => {
//     res.end('deleting the dish: '+req.params.dishId)
// });