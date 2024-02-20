# Payment Form Widget

A simple react app containing a payment form widget for zoid powered cross-domain hosting.

### Requirements

* [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Standalone use

In the root directory of this project (the directory containing this README file) run

```bash
npm install
```

This will install the required modules. Then create a new .env file by running

```bash
cp sample_env .env
```
Change the values in the .env file to reflect your settings if you want run the app in production mode.

To start the application (in developer mode) using nodemon run

```bash
sudo npm start
```

To start the application as a standalone daemon, run 

```bash
```

If changes have been made to the files, run this command before starting the app.
```bash
npm run build
```

## Cross-domain use

This application can be loaded as an iframe into a parent component utilizing zoid which simplifies communication between parent and child page. Both, parent and child, must share the same component declaration, therefore changes made to the zoid component declaration in `src/components/Zoid.js` must be accompanied by similar changes to the parent component declaration to prevent breaks. This is especially true for the properties `url` and `tag`.

### Component declaration
```js
const PaymentForm = zoid.create({
    tag: "payment-form-widget",
    url: url,
    dimensions: {
        width: "100%",
        height: "100%"
    },
    autoresize: false,
});
```
### Props
The application should receive props from the parent window:
#### amount (number)
Amount to be paid by the user.

#### currency (string, 3 characters)
Currency in that `amount` should be paid.

#### sandbox (boolean)
Determines which payment url should be used.

#### merchantText (string)
Custom text shown to the user at the top of the form.

#### onResult (func)
Callback function for parent window. Returns data received by payment provider and should return payment status/message and an order id.