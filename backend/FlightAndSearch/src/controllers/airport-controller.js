const {AirportService} = require("../services/index");
const airportService = new AirportService();
const create = async (req,res) => {
    try {
        const response = await airportService.create(req.body);
        return res.status(201).json({
            data:response,
            success:true,
            message:"Successfully created a Airport",
            err:{}
        })
        
    } catch (error) {
        console.log("Something went wrong in the controller layer");
        return res.status(500).json({
            data:{},
            success:false,
            message:"Not able to create a Airport",
            err:error
        })
        
    }
}
module.exports = {
    create

}