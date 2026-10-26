const CrudRepository = require("./crud-repository");
const {Airport} = require("../models/index");

class AirpoirtRepository extends CrudRepository{
    constructor(){
        super(Airport);
    }
}
module.exports = AirpoirtRepository;
