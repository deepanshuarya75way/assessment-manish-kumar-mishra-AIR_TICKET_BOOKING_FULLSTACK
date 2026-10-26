const {CityService} = require('../services/index');
/**
   *POST
 */
const cityService = new CityService();
const create = async (req, res) => {
    try {
        const city = await cityService.createCity(req.body);
        return res.status(201).json({
            data: city,
            success: true,
            message: "Successfully created a city",
            err: {}
        });
    } catch (error) {
        console.log("Something went wrong in the controller layer",error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Failed to create a city",
            err: error
        });
    }
}
const destroy = async (req, res) => {
    try {
        const response = await cityService.deleteCity(req.params.id);
        return res.status(200).json({
            data: response,
            success: true,
            message: "Successfully deleted a city",
            err: {}
        });
        
        
    } catch (error) {
        console.log("Something went wrong in the controller layer",error);
        return res.status(500).json({
            data: {},
            success: false, 
            message: "Failed to delete a city",
            err: error
        });
    }
}
const get = async(req, res) => {
    try {
        const response = await cityService.getCity(req.params.id);
        return res.status(200).json({
            data: response,
            success: true,
            message: "Successfully fetched a city",
            err: {}
        });
        
    } catch (error) {
        console.log("Something went wrong in the controller layer",error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Failed to fetch a city",
            err: error
        });
    }
}
const update = async(req, res) => {
    try {
        const response = await cityService.updateCity(req.params.id, req.body);
        return res.status(200).json({
            data: response,
            success: true,
            message: "Successfully updated a city",
            err: {}
        });
        
    } catch (error) {
        console.log("Something went wrong in the controller layer",error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Failed to update a city",
            err: error
        });
    }
} 
const getAll = async(req, res) => {
    try {
        const cities = await cityService.getAllCities(req.query);
        return res.status(200).json({
            data: cities,
            success: true,
            message: "Successfully fetched all cities",
            err: {}
        });
        
    } catch (error) {
        console.log("Something went wrong in the controller layer",error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Failed to fetch all cities",
            err: error
        });
    }
}

module.exports = {
    create,
    destroy,
    get,
    update,
    getAll
}