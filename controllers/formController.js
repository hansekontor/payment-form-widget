// Controller for Form Widget
require('dotenv').config();

module.exports = {
    async getForm(req, res) {
        const isDevMode = process.env.NODE_ENV === "development";
        const widgetUrl = isDevMode ? "http://localhost:8000/form" : `https://${process.env.HOSTNAME}/form`;
        
        return res.render('Form', { widgetUrl });
    },
};