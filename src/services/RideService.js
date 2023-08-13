// // Rider Service
// // The rider service can have an endpoint to handle the rider's request for available drivers in a particular location. Here's an example code:
// // javascript
// // Copy code
// const express = require('express');
// const app = express();

// // Define an endpoint to handle rider's request for available drivers
// app.post('/available-drivers', (req, res) => {
//   // Retrieve the location from the rider's request
//   const { location } = req.body;

//   // Send a request to the driver service to get a list of available drivers in the location
//   axios.post('http://driver-service:3000/drivers', { location })
//     .then(response => {
//       // Respond to the rider with the list of available drivers
//       res.json(response.data);
//     })
//     .catch(error => {
//       // Handle errors
//       console.error(error);
//       res.status(500).send('Internal server error');
//     });
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Rider service is listening on port 3000!');
// });



// // Driver Service:

// // javascript
// // Copy code
// const express = require('express');
// // const app = express();

// // Define an endpoint to handle the rider service's request for available drivers
// app.post('/drivers', (req, res) => {
//   // Retrieve the location from the rider service's request
//   const { location } = req.body;

//   // Use a real-time location tracking system to find available drivers in the location
//   const availableDrivers = findAvailableDrivers(location);

//   // Respond with a list of available drivers
//   res.json(availableDrivers);
// });

// // Function to find available drivers using a real-time location tracking system
// function findAvailableDrivers(location) {
//   // In this example, we assume that we have a list of drivers with their real-time location data in the database
//   const drivers = [
//     { id: 1, name: 'John', location: { lat: 37.7749, lng: -122.4194 }, available: true },
//     { id: 2, name: 'Jane', location: { lat: 37.7749, lng: -122.4194 }, available: false },
//     { id: 3, name: 'Bob', location: { lat: 37.7749, lng: -122.4194 }, available: true },
//     // ...
//   ];

//   // Filter the list of drivers by location and availability
//   const availableDrivers = drivers.filter(driver => {
//     const { lat, lng } = driver.location;
//     const driverLocation = { lat, lng };
//     const distance = getDistance(location, driverLocation); // Use a distance calculation function to determine the distance between the rider's location and the driver's location
//     const maxDistance = 10; // Set a maximum distance for available drivers (e.g. 10 km)
//     return distance <= maxDistance && driver.available;
//   });

//   // Return the list of available drivers
//   return availableDrivers;
// }

// // Function to calculate the distance between two points using the Haversine formula
// function getDistance(point1, point2) {
//   const { lat: lat1, lng: lng1 } = point1;
//   const { lat: lat2, lng: lng2 } = point2;
//   const R = 6371e3; // Earth's radius in meters
//   const φ1 = (lat1 * Math.PI) / 180; // Convert lat1 to radians
//   const φ2 = (lat2 * Math.PI) / 180; // Convert lat2 to radians
//   const Δφ = ((lat2 - lat1) * Math.PI) / 180; // Convert Δlat to radians
//   const Δλ = ((lng2 - lng1) * Math.PI) / 180; // Convert Δlng to radians
//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const d = R * c; // Distance in meters
//   return d / 1000; // Convert distance to kilometers
// }

// // Start the server
// app.listen(3000, () => {
//   console.log('Driver service is listening on port 3000!');
// });