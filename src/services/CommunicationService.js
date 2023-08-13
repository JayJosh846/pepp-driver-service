const amqp = require('amqplib/callback_api');
const {
    TripService, 
    IPandLocationService
} = require('../services');
const {
    Config
} = require('../utils');
const { QUEUE } = require('../utils/constants');


const rabbitmq_url = Config.rabbitMqConnectionURL


const createTrip = async (ride) => {
    const data = JSON.parse(ride);
    const availableDrivers = await IPandLocationService.getAllAvailableDriverLocations({
        latitude: data.latitude,
        longitude: data.longitude
    })

}




amqp.connect(rabbitmq_url, function (err, conn) {
    conn.createChannel(function (err, ch) {
        ch.consume(QUEUE.RIDE_REQUEST, function (msg) {
            console.log('.. Ride worker ...');
            setTimeout(() => {
                console.log("Message:", JSON.parse(msg.content));
                createTrip(msg.content);
                ch.ack(msg);
            }, 4000);
        }, { noAck: false }
        );
    });
})


 