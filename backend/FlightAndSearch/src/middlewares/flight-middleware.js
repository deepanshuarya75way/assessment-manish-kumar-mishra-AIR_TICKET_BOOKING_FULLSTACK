const {ClientErrorCodes} = require('../utils/error-codes');

const validateFlights = (req, res, next) => {
    if(!req.body.flightNumber || !req.body.airplaneId ||
         !req.body.departureTime || !req.body.arrivalTime || !req.body.departureAirportId || !req.body.arrivalAirportId || !req.body.price) {
        return res.status(ClientErrorCodes.BAD_REQUEST).json({
            data:{},
            success: false,
            message: "Validation error",
            error: "Missing required flight information"
        });
    }
    next();
}

module.exports = {
    validateFlights
}