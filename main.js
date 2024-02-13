ReactDOM = require('react-dom');
React = require('react');

window.valid = require('card-validator');

const countryDataObj = require('country-data').countries;

window.Countries = Object.keys(countryDataObj)
.filter(key => key.length === 2 && countryDataObj[key].status === "assigned")
.map(function(key) {
    return {
        label: countryDataObj[key].name,
        code: countryDataObj[key].alpha2,
        callingCode: countryDataObj[key].countryCallingCodes[0]
    }
});
