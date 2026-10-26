const {StatusCodes} = require('http-status-codes');

const { ValidationError ,AppError } = require('../utils/errors/index');
const {Booking} = require('../models/index');

class BookingRepository{
    async create(data){
        try {
            const booking = await Booking.create(data);
            return booking;
            
        } catch (error) {
            if(error.name == 'SequelizeValidationError'){
                throw new ValidationError(error);
            }
            throw new AppError('RepositoryLayer',
                'Cannot create a new booking object in the database',
                'There was an error while creating the booking',
                StatusCodes.INTERNAL_SERVER_ERROR
            )
            
        }
    }
    async update(bookingId , data){
        try {
                     const booking = await Booking.findByPk(bookingId);
           if(data.status){
                        booking.status = data.status;
           }
                        await booking.save();
                        return booking;
            
        } catch (error) {
             throw new AppError('RepositoryLayer',
                'Cannot update a new booking object in the database',
                'There was an error while updating the booking',
                StatusCodes.INTERNAL_SERVER_ERROR
            )
            
        }
        
    }
}
module.exports = BookingRepository;