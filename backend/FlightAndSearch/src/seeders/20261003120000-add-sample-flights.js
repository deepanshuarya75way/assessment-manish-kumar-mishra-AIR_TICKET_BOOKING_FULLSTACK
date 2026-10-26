'use strict';

const airportRoutes = [
  ['Chhatrapati Shivaji Maharaj International Airport', 'Kempegowda International Airport Bengaluru'],
  ['Indira Gandhi International Airport', 'Chhatrapati Shivaji Maharaj International Airport'],
  ['Kempegowda International Airport Bengaluru', 'Chennai International Airport'],
  ['Chennai International Airport', 'Indira Gandhi International Airport'],
  ['Indira Gandhi International Airport', 'Chennai International Airport'],
  ['Chennai International Airport', 'Chhatrapati Shivaji Maharaj International Airport'],
  ['Kempegowda International Airport Bengaluru', 'Indira Gandhi International Airport'],
  ['Chhatrapati Shivaji Maharaj International Airport', 'Indira Gandhi International Airport']
];

const flightNumbers = airportRoutes.map((route, index) => `AT${1001 + index}`);

module.exports = {
  async up(queryInterface) {
    const [airports] = await queryInterface.sequelize.query('SELECT id, name FROM Airports');
    const [airplanes] = await queryInterface.sequelize.query('SELECT id, capacity FROM Airplanes ORDER BY id');
    const [existingFlights] = await queryInterface.sequelize.query('SELECT flightNumber FROM Flights');
    const airportsByName = new Map(airports.map((airport) => [airport.name, airport]));
    const existingFlightNumbers = new Set(existingFlights.map((flight) => flight.flightNumber));

    if (!airplanes.length) throw new Error('Seed airplanes before adding sample flights.');

    const now = new Date();
    const flights = airportRoutes.flatMap(([departureName, arrivalName], index) => {
      const flightNumber = flightNumbers[index];
      const departureAirport = airportsByName.get(departureName);
      const arrivalAirport = airportsByName.get(arrivalName);
      if (existingFlightNumbers.has(flightNumber)) return [];
      if (!departureAirport || !arrivalAirport) {
        throw new Error(`Required sample airports were not found for ${flightNumber}.`);
      }

      const airplane = airplanes[index % airplanes.length];
      const departureTime = new Date(now);
      departureTime.setUTCDate(departureTime.getUTCDate() + 7 + index);
      departureTime.setUTCHours(7 + (index % 10), 0, 0, 0);

      return [{
        flightNumber,
        airplaneId: airplane.id,
        departureAirportId: departureAirport.id,
        arrivalAirportId: arrivalAirport.id,
        departureTime,
        arrivalTime: new Date(departureTime.getTime() + 2 * 60 * 60 * 1000),
        price: [4200, 5100, 3600, 5900, 4700, 3300, 6200, 3900][index],
        boardingGate: `G${index + 1}`,
        totalSeats: airplane.capacity,
        createdAt: now,
        updatedAt: now
      }];
    });

    if (flights.length) await queryInterface.bulkInsert('Flights', flights);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Flights', {
      flightNumber: { [Sequelize.Op.in]: flightNumbers }
    });
  }
};