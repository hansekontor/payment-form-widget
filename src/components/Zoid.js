// get env settings
const devMode = process.env.NODE_ENV !== "production";
import * as zoid from 'zoid/dist/zoid.frameworks.min.js';

// build url
const devUrl = "http://localhost:3000";
const liveUrl = `https://${process.env.HOSTNAME}`;
const url = devMode ? devUrl : liveUrl;


// init zoid component
const PaymentForm = zoid.create({
    tag: "payment-form-widget",
    url: url,
    dimensions: {
        width: "100%",
        height: "100%"
    },
    autoresize: false,
});

export default PaymentForm;