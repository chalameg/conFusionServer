const express = require('express');
const bodyParser = require('body-parser')

const Favorites = require('../models/favorite');
var authenticate = require('../authenticate');
var cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')  
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "Application/json");
        res.json(favorites); 
    }, (err)=>next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (favorites == null) {
            Favorites.create({user: req.user._id})
            .then((favorites) => {
                for (let i = 0; i < req.body.length; i++) {
                    favorites.dishes.push(req.body[i]);   
                }
                favorites.save()
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "Application/json");
                    res.json(favorites);
                }, (err) => next(err))
                .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else if(favorites !== null) {
            for (let j = 0; j < req.body.length; j++) {

                for (let i = 0; i < favorites.dishes.length; i++) {
    
                    if (req.body[j]._id == favorites.dishes[i]) {
                        console.log(`j = ${j} i = ${i}`);
                        const err = new Error('Already favorited dishes with id: '+req.body[j]._id+'!');
                        err.status = 403;
                        next(err);
                        return;
                    }
                }
            }
            for (let i = 0; i < req.body.length; i++) {
                favorites.dishes.push(req.body[i]);   
            }
            favorites.save()
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "Application/json");
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err)=>next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({user: req.user})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "Application/json");
        res.json({"success": "successfully removed the favorited dishes"});
    }, (err)=>next(err))
    .catch((err) => next(err));
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if(!favorites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "Application/json");
            res.json({"exists": false, "favorites": favorites});
        }
        else {
            if(favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "Application/json");
                res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader("Content-Type", "Application/json");
                res.json({"exists": true, "favorites": favorites});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (favorites == null) {
            Favorites.create({user: req.user._id})
            .then((favorites) => {
                favorites.dishes.push({'_id': req.params.dishId })
                favorites.save()
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "Application/json");
                    res.json(favorites);
                }, (err) => next(err))
                .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else if(favorites !== null) {
            if(favorites.dishes.indexOf(req.params.dishId) < 0) {
                favorites.dishes.push({'_id': req.params.dishId })
                favorites.save()
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "Application/json");
                    res.json(favorites);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
            else {
                const err = new Error('Already favorited dishes with id: '+req.params.dishId+'!');
                err.status = 403;
                next(err);
            }
        }
    }, (err)=>next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) =>{
        if(favorites !== null){
            // for (let i = 0; i < favorites.dishes.length; i++) {
            //     if(favorites.dishes[i] == req.params.dishId) {
            //         favorites.dishes[i].remove();
            //     }
            //     favorites.save()
            //     .then((favorites) => {
            //         res.statusCode = 200;
            //         res.setHeader("Content-Type", "Application/json");
            //         res.json(favorites);
            //     }, (err)=>next(err))
            // }
            if(favorites.dishes.indexOf(req.params.dishId) > 0 ){
                favorites.dishes.id(req.params.dishId).remove();
                favorites.save()
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "Application/json");
                    res.json(favorites);
                }, (err)=>next(err))
            }else {
                err = new Error("You have not favorited a dish with id: "+req.params.dishId );
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error("You have not favorited a dish yet!");
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
});


module.exports = favoriteRouter;