const airplane = require('../models/airplane');
const {FlightRepository , AirplaneRepository} = require('../repository/index');
const logger = require('../utils/logger.js');

const { compareTime } = require('../utils/helper')
class FlightService {
    constructor(){
        this.airplaneRepository = new AirplaneRepository();
        this.flightRepository = new FlightRepository();
    }
    async createFlight(data){
        try {
            if(!compareTime(data.arrivalTime ,data.departureTime)){
                throw {error: 'Arrival Time should not be less than departure'}
            }
            const airplane = await this.airplaneRepository.getAirplane(data.airplaneId);
            const flight = await this.flightRepository.createFlight({...data, totalSeats: airplane.capacity});

            return flight;
        } catch (error) {
            console.log("Something went wrong in service layer",error);
            throw error;
        }
}
async getAllFlightData(data){
    
    try {
        const flights = await this.flightRepository.getAllFlights(data);
        return flights;

    } catch (error) {
        console.log("Something went wrong in service layer",error);
        logger.error("Error in fetching flights",error);

            throw error;
        
    }

}
async getFlight(flightId){
    try {
        const flight = await this.flightRepository.getFlight(flightId);
        return flight;
        
    } catch (error) {
        console.log("Something went wrong in service layer",error);
        throw {error}
    }
}

async updateFlight(flightId,data){

      try {
        const response = await this.flightRepository.updateFlights(flightId,data);
        return response;
        
    } catch (error) {
        console.log("Something went wrong in service layer",error);
        throw {error}
    }

}

}

module.exports = FlightService;
// /**
//  * flightNumber,
//  * airplaneId,
//  * departureAirportId,
//  * arrivalAirportId,
//  * arrivalTime,
//  * departureTime,
//  * price,
//  * totalSeats -> airplane
//  */