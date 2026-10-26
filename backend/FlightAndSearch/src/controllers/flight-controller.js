const {FlightService} = require('../services/index');
const {SuccessCodes} = require('../utils/error-codes');
const flightService = new FlightService();

const create = async (req,res) => {
    try {
        let flightRequestData = {
            flightNumber: req.body.flightNumber,
            airplaneId: req.body.airplaneId,
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            departureAirportId: req.body.departureAirportId,
            arrivalAirportId: req.body.arrivalAirportId,
            price: req.body.price
        }
        const flight = await flightService.createFlight(flightRequestData);  
        return res.status(SuccessCodes.CREATED).json({
            data: flight,
            success: true,  
            message: "Successfully created a flight",
            err: {}
        })
    } catch (error) {
        console.log("Something went wrong in controller layer",error);
        return res.status(500).json({       
            data: {},
            success: false,
            message: "Unable to create a flight",
            err: error
        })
    }
}
const getAll= async (req,res) => {
    try {
        const flights = await flightService.getAllFlightData(req.query);
        return res.status(SuccessCodes.OK).json({
            data: flights,
            success: true,
            message: "Successfully fetched all flights",
            err: {}
        })
    } catch (error) {
        console.log("Something went wrong in controller layer",error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Unable to fetch flights",
            err: error
        })
    }
}
const get = async (req,res) => {
        try {
            const flight = await flightService.getFlight(req.params.id);
            return res.status(SuccessCodes.OK).json({
                data: flight,
                success: true,
                message: "Successfully fetched the flight",
                err: {}
            })
        } catch (error) {
            console.log("Something went wrong in controller layer",error);
            return res.status(500).json({
                data: {},
                success: false,
                message: "Unable to fetch the flight",
                err: error
            })
        }
    }

const update = async(req,res) =>{
            try{
            const flight = await flightService.updateFlight(req.params.id,req.body);
            return res.status(SuccessCodes.OK).json({
                data: flight,
                success: true,
                message: "Successfully updated the flight",
                err: {}
            })
        } catch (error) {
            console.log("Something went wrong in controller layer",error);
            return res.status(500).json({
                data: {},
                success: false,
                message: "Unable to update the flight",
                err: error
            })
        }
    }


module.exports = {

    create,
    getAll,
    get,
    update
}