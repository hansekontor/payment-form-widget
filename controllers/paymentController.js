// controller responsible for sending the form data to API and relaying response
require('dotenv').config();
const axios = require('axios');


module.exports = {
    async postPayment(req, res) {
        const input = req.body;
        console.log("postPayment input", input);
        
        const url = "https://sandbox.cmpct.org/v2?test=uptime";
        const result = await axios.get(url);
        const status = result.data === "success" ? true : false;
        console.log("result", result.data);

        // add response management
        return res.render('Status', { status });
    },
    async postSandbox(req, res) {
        const input = req.body;
        console.log("postPayment sandbox form input", input);
        const ipAddress = req.socket.remoteAddress;
        console.log("ipAddress", ipAddress);
        const ipAddresses = req.header('x-forwarded-for');
        console.log("ipAddresses", ipAddresses);

        const form = {
            ... input,
            ip_address: ipAddress,
            currency: "USD",
            response_url: "https://dev.cert.cash:5010/payment/listen"
        };
    
        const sandboxUrl = "https://portal.gatewaypay.io/api/test/transaction";
        const options = {
                headers: {
                        'Authorization': `Bearer ${process.env.API_KEY}`
                }
        };
    
        const result = await axios.post(sandboxUrl, form, options);
        console.log("result", result.data);

        const status = true;
        // add response management
        return res.render('Result', { status });
    },
    async postPaymentResult(req, res) {
        const result = req.body;
        const code = result.responseCode;
        const msg = result.responseMessage;
        console.log("postPaymentResult", result);

        return res.render('Status', { code, msg });
    }
}