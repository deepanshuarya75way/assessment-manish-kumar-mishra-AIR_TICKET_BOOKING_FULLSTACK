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

const startDate = new Date('2026-10-25T00:00:00.000Z');
const endDate = new Date('2026-11-05T00:00:00.000Z');
const prices = [4200, 5100, 3600, 5900, 4700, 3300, 6200, 3900];

function getFlightDates() {
  const dates = [];
  for (const date = new Date(startDate); date <= endDate; date.setUTCDate(date.getUTCDate() + 1)) {
    dates.push(new Date(date));
  }
  return dates;
}

module.exports = {
  async up(queryInterface) {
    const [airports] = await queryInterface.sequelize.query('SELECT id, name FROM Airports');
    const [airplanes] = await queryInterface.sequelize.query('SELECT id, capacity FROM Airplanes ORDER BY id');
    const [existingFlights] = await queryInterface.sequelize.query('SELECT flightNumber FROM Flights');
    const airportsByName = new Map(airports.map((airport) => [airport.name, airport]));
    const existingFlightNumbers = new Set(existingFlights.map((flight) => flight.flightNumber));

    if (!airplanes.length) throw new Error('Seed airplanes before adding sample flights.');

    const now = new Date();
    const flights = getFlightDates().flatMap((date) => {
      const dateCode = date.toISOString().slice(0, 10).replace(/-/g, '');

      return airportRoutes.flatMap(([departureName, arrivalName], index) => {
        const flightNumber = `AT${dateCode}${String(index + 1).padStart(2, '0')}`;
        if (existingFlightNumbers.has(flightNumber)) return [];

        const departureAirport = airportsByName.get(departureName);
        const arrivalAirport = airportsByName.get(arrivalName);
        if (!departureAirport || !arrivalAirport) {
          throw new Error(`Required sample airports were not found for ${flightNumber}.`);
        }

        const airplane = airplanes[index % airplanes.length];
        const departureTime = new Date(date);
        departureTime.setUTCHours(7 + (index % 8), 0, 0, 0);

        return [{
          flightNumber,
          airplaneId: airplane.id,
          departureAirportId: departureAirport.id,
          arrivalAirportId: arrivalAirport.id,
          departureTime,
          arrivalTime: new Date(departureTime.getTime() + 2 * 60 * 60 * 1000),
          price: prices[index],
          boardingGate: `G${index + 1}`,
          totalSeats: airplane.capacity,
          createdAt: now,
          updatedAt: now
        }];
      });
    });

    if (flights.length) await queryInterface.bulkInsert('Flights', flights);
  },

  async down(queryInterface, Sequelize) {
    const flightNumbers = getFlightDates().flatMap((date) => {
      const dateCode = date.toISOString().slice(0, 10).replace(/-/g, '');
      return airportRoutes.map((_, index) => `AT${dateCode}${String(index + 1).padStart(2, '0')}`);
    });

    await queryInterface.bulkDelete('Flights', {
      flightNumber: { [Sequelize.Op.in]: flightNumbers }
    });
  }
};
