// controller responsible for sending the form data to API and relaying response
require('dotenv').config();
const axios = require('axios');


module.exports = {
    async postPayment(req, res) {
        const input = req.body;
        console.log("postPayment input", input);
        
        const url = "https://portal.gatewaypay.io/api/transaction";
        const result = await axios.get(url);
        console.log("result", result.data);
        const responseCode = result.data.responseCode;
        const responseMessage = result.data.responseMessage;

        return res.json({ responseCode, responseMessage });
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
        const responseCode = result.data.responseCode;
        const responseMessage = result.data.responseMessage;

        return res.json({ responseCode, responseMessage });
    },
    async postPaymentResult(req, res) {
        const result = req.body;
        const code = result.responseCode;
        const msg = result.responseMessage;
        // process payment...
        console.log("postPaymentResult", result);

        return res.send("OK");
    }
}