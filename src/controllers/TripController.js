const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {
    IPandLocationService,
    UserService,
    TripService,
    WalletService,
    BlockchainService
} = require('../services');
const {
    Response,
    Rediscache,
    publishToQueue
} = require('../libs');
const { logger } = require('../libs/Logger');

const {
    HttpStatusCode,
    createHash,
    generateTransactionRef
} = require('../utils');
const { QUEUE } = require('../utils/constants');
const TransactionService = require('../services/TransactionService');





class TripController {

    static async driverGoOnline(req, res, next) {
        try {
            const driver = req.user;
            const {
                city,
                region,
                country,
                latitude,
                longitude,
            } = await IPandLocationService.determineLocationByIP();
            const location = { city, region, country, latitude, longitude };
            const driverFound = await IPandLocationService.findDriverLocation(
                driver.id
            )
            if (driverFound === null) {
                await IPandLocationService.addLocation({
                    driverId: driver.id,
                    city: city,
                    region: region,
                    country: country,
                    latitude: latitude,
                    longitude: longitude,
                    available: true
                });
            } else {
                await IPandLocationService.updateDriverLocation(
                    driver.id, {
                    city: city,
                    region: region,
                    country: country,
                    latitude: latitude,
                    longitude: longitude,
                    available: true
                })
            }
            logger.info('Driver with Id: ' + driver.id + ' is available');
            Response.setSuccess(
                HttpStatusCode.STATUS_OK,
                'Location Updated',
                location
            );
            return Response.send(res);
        } catch (err) {
            Response.setError(
                HttpStatusCode.STATUS_BAD,
                'Something went wrong. Please try again later');
        }
    }


    static async rideResponse(req, res) {
        const drivers = req.drivers;
        const { tripId } = req.params;
        const { decision } = req.body;
        try {
            drivers.forEach(async (driverId) => {
                if (decision === "accept" || "Accept" || "ACCEPT") {
                    const tripUpdate = {
                        id: parseInt(tripId),
                        driverId: driverId,
                    }
                    const queueResponse = await publishToQueue(
                        QUEUE.DRIVER_RESPONSE,
                        JSON.stringify(tripUpdate)
                    )
                    logger.info('Driver with Id: ' + driverId + ' accepted ride request');
                }
            })
            Response.setSuccess(
                HttpStatusCode.STATUS_OK,
                'Driver Responded',
                "Successfully published"
            );
            return Response.send(res);
        }
        catch (error) {
            Response.setError(
                HttpStatusCode.STATUS_INTERNAL_SERVER_ERROR,
                `Server Error: Please retry.`,
            );
            return Response.send(res);
        }
    }


    static async startRide(req, res) {
        const { tripId } = req.params;
        try {
            const tripUpdate = {
                id: parseInt(tripId),
                status: "ONGOING",
            }
            const queueResponse = await publishToQueue(
                QUEUE.START_TRIP,
                JSON.stringify(tripUpdate)
            )
            logger.info('Trip: ' + tripId + ' started');
            Response.setSuccess(
                HttpStatusCode.STATUS_OK,
                'Trip Commenced',
                true
            );
            return Response.send(res);
        }
        catch (error) {
            Response.setError(
                HttpStatusCode.STATUS_INTERNAL_SERVER_ERROR,
                `Server Error: Please retry.`,
            );
            return Response.send(res);
        }
    }


    static async endRide(req, res) {
        const driver = req.user;
        const {
            tripId,
            riderId } = req.params;
        const newTripId = parseInt(tripId);
        const newRiderId = parseInt(riderId);

        try {
            const ref = generateTransactionRef();
            const trip = await TripService.findTrip(newTripId);
            const rider = await UserService.findRider(newRiderId);
            const driverWallet = await WalletService.findDriverWallet(driver.id);
            const riderWallet = await WalletService.findRiderWallet(newRiderId);
            const transferResponse = await BlockchainService.transfer(
                rider.email,
                trip.amount,
                driverWallet.walletAddress
            )

            if (!transferResponse) {
                Response.setError(
                    HttpStatusCode.STATUS_RESOURCE_NOT_FOUND,
                    'Transfer Failed. Please try again',
                  );
                  return Response.send(res);
            }

            const tripUpdate = await TripService.updateTrip(
                newTripId, {
                status: "COMPLETED",
            })

            const transactionData = {
                reference: ref,
                description: `Payment for ride #${newTripId}`,
                amount: trip.amount,
                type: 'TRANSFER',
                status: 'COMPLETE',
                riderId: newRiderId,
                driverId: driver.id,
                tripId: newTripId,
                from: riderWallet.walletAddress,
                to: driverWallet.walletAddress
            }
            const transaction = driverWallet.noOfTrans || 0;
            const transactionRider = riderWallet.noOfTrans || 0;
            const fares = riderWallet.totalFares || 0;
            const noOfTransactions = transaction + 1;
            const noOfTransactionsRider = transactionRider + 1;
            const totalFares = fares + 1;
            await TransactionService.createTransaction(transactionData);
            const driverWalletBalance = await BlockchainService.balance(driver.email);
            const riderWalletBalance = await BlockchainService.balance(rider.email);

            await WalletService.updateDriverWallet(
                driver.id, {
                walletBalance: driverWalletBalance.Balance,
                noOfTrans: noOfTransactions,
            });

            await WalletService.updateRiderWallet(
                newRiderId, {
                walletBalance: riderWalletBalance.Balance,
                noOfTrans: noOfTransactionsRider,
                totalFares: totalFares
            });
            logger.info('Trip: ' + newTripId + ' ended successfully');
            Response.setSuccess(
                HttpStatusCode.STATUS_OK,
                'Trip Ended Successfully',
                tripUpdate
            );
            return Response.send(res);
        }
        catch (error) {
            Response.setError(
                HttpStatusCode.STATUS_INTERNAL_SERVER_ERROR,
                `Server Error: Please retry.`,
            );
            return Response.send(res);
        }
    }

    static async getTrips(req, res) {
        try {
            const trips = await TripService.findTrips();
            Response.setSuccess(
                HttpStatusCode.STATUS_OK,
                'Available Trips',
                trips
            );
            return Response.send(res);
        }
        catch (error) {
            Response.setError(
                HttpStatusCode.STATUS_INTERNAL_SERVER_ERROR,
                `Server Error: Please retry.`,
            );
            return Response.send(res);
        }
    }

}

module.exports = TripController;
