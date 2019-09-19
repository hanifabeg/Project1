// REQUIRE VENDOR LIBS
var Twitter = require('twitter')
const express = require('express')
const corsMiddleware = require('restify-cors-middleware')
    // CONFIGURE ENVIRONMENT VARIABLES
const dotenv = require('dotenv').config()
    // INSTANTIATE APP
const app = express()
    // SETUP ROUTER
const router = express.Router()
    //CONFIGURE KEYS
var client = new Twitter({
    consumer_key: process.env.consumer_key
    , consumer_secret: process.env.consumer_secret
    , access_token_key: process.env.access_token_key
    , access_token_secret: process.env.access_token_secret
});
// CONFIGURE CORS
const cors = corsMiddleware({
    origins: ['*']
    , allowHeaders: ['*']
})
router.use(cors.preflight)
router.use(cors.actual)
    //IMPLEMETING CONTROLLER
router.get('/users/:id/', (req, res) => {
        var Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        var count = [0, 0, 0, 0, 0, 0, 0]
        if (typeof (req.params.id) != "string") {
            res.status(400).send("error")
        }
        client.get('statuses/user_timeline', {
            screen_name: req.params.id
            , count: 10
            , max_id: req.params.last_id
        }, function (error, tweets, response) {
            if (!error) {
                var NewTweets = [];
                tweets.forEach(function (ele) {
                    console.log(ele.text)
                    console.log(ele.created_at)
                    let index = Days.indexOf(ele.created_at.slice(0, 3))
                    count[index]++;
                    NewTweets.push(ele.text)
                })
                var last_id = tweets[tweets.length - 1].id
                res.send({
                    "NewTweets": NewTweets
                    , "last_d": last_id
                    , "count": count
                })
            }
            else {
                res.status(400).send(error)
            }
        })
    })
    // REGISTER ROUTES
app.use('/api', router)
    // START SERVER
app.listen(3000)