//setup sauces router 
const express = require('express');
const router = express.Router();

//import multer with token authorization function from middleware 
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//import Sauces functions from controllers
const sauceCtrl = require('../controllers/sauce');

//sets up endpoints for sauces 
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer,sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

//navigate router
module.exports = router;