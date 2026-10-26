const AirplaneRepository = require('./airplane-repository');
const CrudRepository = require('./crud-repository');

module.exports = {
    CityRepository: require('./city_repository'),
    AirplaneRepository: require('./airplane-repository'),
    FlightRepository: require('./flight-repository'),
    AirportRepository: require('./airport-repository'),
    CrudRepository: require('./crud-repository')
};