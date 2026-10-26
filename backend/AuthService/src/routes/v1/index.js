const express = require('express');

const userController = require('../../controllers/user-controller');

const {AuthRequestValidators} = require('../../middlewares/index')

const router = express.Router();

router.post('/signup', userController.create);

router.post('/signin',AuthRequestValidators.validateUserAuth , userController.signIn);

router.get('/isAuthenticated',userController.isAuthenticated);

router.get('/dummy', (req,res) => {
    res.status(200).json({
        message:"OK"
    });
});

router.get('/isAdmin',AuthRequestValidators.validateIsAdminRequest , userController.isAdmin);

module.exports = router;

