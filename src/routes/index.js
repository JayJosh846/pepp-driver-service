const homeRouter = require('./home.js');
const userRouter = require('./users.js');
const authRouter = require('./auth.js');
const tripsRouter = require('./trips.js');
const express = require('express');
const { Router } = express;
const router = Router();

// Blockchain File Management 
// router.use('/', homeRouter)
router.use('/user', userRouter)
router.use('/auth', authRouter) 
router.use('/trips', tripsRouter) 

// router.use('/qrcode', qrQodeRouter)
// router.use('/qrcode', apiRouter)



module.exports = router;
