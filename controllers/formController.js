// Controller for From Widget
const path = require('path');
const fs = require('fs');

module.exports = {
    async getForm(req, res) {
        return res.render('Form', { success: false });
    },
};