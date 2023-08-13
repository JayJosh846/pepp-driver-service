const express = require("express");
const router = express.Router();
const { Auth } = require("../middleware/auth");
const { isDriver } = require("../middleware/isDriver");
const { 
        TripController
    } = require("../controllers")
    const { 
        AuthValidator,
        ParamValidator
     } = require('../validators')





router
.route('/driver-active')
.post(
    Auth,
    TripController.driverGoOnline
);

router
  .route('/available-trips')
  .get(
    Auth,
    TripController.getTrips
  )

router
  .route('/ride-response/:riderId/:tripId')
  .post(
    Auth,
    ParamValidator.RiderId,
    ParamValidator.TripId,
    isDriver,
    TripController.rideResponse
  )

  router
  .route('/start-ride/:riderId/:tripId')
  .post(
    Auth,
    ParamValidator.RiderId,
    ParamValidator.TripId,
    isDriver,
    TripController.startRide
  )

  router
  .route('/end-ride/:riderId/:tripId')
  .post(
    Auth,
    ParamValidator.RiderId,
    ParamValidator.TripId,
    isDriver,
    TripController.endRide
  )
module.exports = router;


 