// All main index routes

const express = require('express');
const router = express.Router();

const { getForm } = require('../controllers/formController');

router.get('/', getForm);

module.exports = router;