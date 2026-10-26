const {BookingService }  = require('../services/index')

const bookingService = new BookingService();

const create = async (req, res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        return res.status(201).json({
            data: response,
            success: true,
            message: "Successfully created a booking",
            err: {}
        })
        
    } catch (error) {
        return res.status(500).json({
            data: {},
            success: false,
            message: "Failed to create a booking",
            err: error
        })
    }
}
module.exports = {
    create
}