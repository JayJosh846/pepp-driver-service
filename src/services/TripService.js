const {
    Config,
    generateFIATRef
} = require('../utils');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { Logger } = require('../libs');
const axios = require("axios");
const { get } = require('https');
const {
    IPandLocationService
} = require('../services');


class TripService {

    static async addTrip(newTrip) {
        return await prisma.trips.create({
            data: newTrip 
        });
    }

    static async findTrip(id) {
        return await prisma.trips.findUnique(
            { 
                where: { 
                    id
                }})
    }

    static async findTrips() {
        const trip = await prisma.trips.findMany(
            { 
                where: { 
                    status: "CREATED"
                }})
            return trip;
    }

    static async updateTrip(id, data) {
        return await prisma.trips.update({
            where: {
                id
            },
            data
        })
    }
}

module.exports = TripService;
