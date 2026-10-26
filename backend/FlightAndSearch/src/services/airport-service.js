const CrudService = require("./crud-service");
const { AirportRepository } = require("../repository/index");

class AirportService extends CrudService{
    constructor(){
        const repository = new AirportRepository();
        super(repository);
    }
}
module.exports = AirportService;