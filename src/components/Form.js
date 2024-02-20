import React from 'react';
import PropTypes from 'prop-types';
import * as valid from 'card-validator';
import styled from 'styled-components';
import Select from 'react-select';
import { countries } from 'country-data';
const countryArray = Object.keys(countries)
    .filter(key => key.length === 2 && countries[key].status === "assigned")
    .map(function(key) {
        return {
            label: countries[key].name,
            code: countries[key].alpha2,
            callingCode: countries[key].countryCallingCodes[0]
        }
});
const selectCountryArray = countryArray.map(function(country) {
    return {
        label: country.label, 
        value: country.label
    };
});

const CustomForm = styled.form`
    background-color: #ffffff;
`;
const Item = styled.div`
    display: inline-flex;
    padding-bottom: 15px;
    width: 100%;
    gap: 5%;
`;
const Errors = styled(Item)`
    padding-bottm: 5px;
    gap: 5px;
    display: inline-flex;
`;
const Error = styled.div`
    color: red;
    line-height: 12px;
    font-weight: 600;
    font-family: "Inter-Medium", Helvetica;
`;
const Input = styled('input').withConfig({shouldForwardProp: (prop) => prop != 'error'})`
    height: 24px;
    width: 100%;
    min-width: 50px;
    background-color: #F6F6F6;
    border-radius: 8px;
    border: ${props => props.error ? 'solid 0.5px red' : 'none'};
    padding: 12px;

    &:focus {
        border: solid 0.5px black; 
    };
`;
const PrefixInput = styled(Input)`
    width: 40px;
    font-weight: 600;
}`;
const PrimaryButton = styled.button`
    all: unset;
    align-items: center;
    background-color: #000000;
    color: #ffffff;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding: 12px 16px;
    position: relative; 
    width: 100%;
    cursor: pointer;
`;
const FormHeader = styled(Item)`
    justify-content: space-between;
`;
const HeaderText = styled.div`
    font-family: "Inter-Medium", Helvetica;
    font-size: 16px;
    font-weight: 500;
    width: fit-content;
`;
const Price = styled(HeaderText)``;
const MerchantInfo = styled(FormHeader)``;
const MerchantText = styled(HeaderText)`
    font-size: 14px;
    font-weight: 450;
`;
const CustomSelect = styled(Select)`
    width: 100%;

    .Select__control {
        height: 48px;
        width: inherit;
        background-color: #F6F6F6;
        border-radius: 8px;
        border: ${props => props.error ? 'solid 0.5px red' : 'none'};
        line-height: 24px;
    }

    .Select__control--is-focused {
        border: solid 0.5px black; 
    }
`;
const Result = styled.p``;



const Form = ({
    passLoadingStatus,
    amount, 
    currency,
    sandbox,
    merchantText
}) => {

    // init states
    const [sectionToShow, setSectionToShow] = React.useState(0);
    const [values, setValues] = React.useState({
        first_name: "",
        last_name: "",
        address: "",
        country: "",
        countryAlpha2: "",
        state: "",
        city: "",
        zip: "",
        email: "",
        phone: "",
        card_no: "",
        expiration: "",
        ccExpiryMonth: "",
        ccExpiryYear: "",
        cvvNumber: "",
        focus: "",
        callingCode: "",
    });
    const [validationErrors, setValidationErrors] = React.useState({});
    const [paymentAllowed, setPaymentAllowed] = React.useState(false);
    const [paymentStatus, setPaymentStatus] = React.useState(false);

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // validates credit card data with card-validator
    const validateCC = () => {
        let err = {
            first_name: false,
            last_name: false,
            card_no: false,
            cvvNumber: false,
            expiration: false,
            zip: false,
        };

        let creditCard = valid.number(values.card_no);

        creditCard.expirationDate = valid.expirationDate(values.expiration);
        creditCard.cvv = valid.cvv(values.cvvNumber);
        const fullName = values.first_name + " " + values.last_name;
        creditCard.cardholderName = valid.cardholderName(fullName);
        creditCard.postalCode = valid.postalCode(values.zip);
        

        // ZIP 
        if (values.zip === null || !values.zip.trim()) {
            err.zip = true;
        } else if (!creditCard.postalCode.isValid) {
            err.zip = true;
        }

        // CVV
        if (values.cvvNumber === null || !values.cvvNumber.trim()) {
            err.cvvNumber = true;
        } else if (!creditCard.cvv.isValid) {
            err.cvvNumber = true;
        } 

        // Expiration
        if (values.expiration === null || !values.expiration.trim()) {
            err.expiration = true;
        } else if (!creditCard.expirationDate.isValid) {
            err.expiration = true;
        } else {
            setValues({
                ...values,
                ccExpiryMonth: creditCard.expirationDate.month,
                ccExpiryYear: creditCard.expirationDate.year
            })
        }

        // Card Number
        if (values.card_no === null || !values.card_no.trim()) {
            err.card_no = "Card Number is missing";
        } else if (!creditCard.isValid) {
            err.card_no = true;
        } 

        // First Name
        if (values.first_name === null || !values.first_name.trim()) {
            err.first_name = "First name is missing";
        } else if (!creditCard.cardholderName.isValid) {
            err.first_name = true;                
        }

        // Last name
        if (values.last_name === null || !values.last_name.trim()) {
            err.last_name = true;  
        }
        
        let isValid = false;
        if (
            !(err.first_name ||
            err.last_name ||
            err.card_no ||
            err.cvvNumberNumber ||
            err.expiration ||
            err.zip)
        ) {
            isValid = true;
        }
        // console.log("validateCC err", err);
        setValidationErrors(err);

        return isValid;

    }
    
    // validates remaining address data
    const validateAddress = () => {
        let err = {
            address: false,
            country: false,
            state: false,
            city: false,
            email: false,
            phone: false,
            callingCode: false
        };

        const keys = Object.keys(err);
        keys.forEach(function(key) {
            if (values[key].length === 0) {
                err[key] = true;
            }
        });

        if (!(values.countryAlpha2 && values.callingCode)) {
            err.country = true;
        }

        let isValid = false;
        if (
            !(err.address ||
            err.country ||
            err.state || 
            err.city ||
            err.email ||
            err.phone)
        ) {
            isValid = true;
        }

        setValidationErrors(err);

        return isValid;
    }

    // standard handler to set new form values to state
    const handleChange = (e) => {
        const {name, value} = e.target;
        setValues({
            ...values, 
            [name] : value
        });
    };

    // specific handler to set country specific values to state
    const handleCountryChange = (e) => {
        console.log("handleCountryChange", e)
        const { value } = e;
        const selectedCountry = countryArray.find(country => country.label === value);
        if (selectedCountry) {
            setValues({
                ...values,
                country: value,
                countryAlpha2: selectedCountry.code,
                callingCode: selectedCountry.callingCode
            })
        } else {
            handleChange(e);
        }
    }                
    
    // auto-complete month and add slash: month / year
    const handleExpirationOnKeyUp = (e) => {
        var inputChar = String.fromCharCode(event.keyCode);
        var code = event.keyCode;
        var allowedKeys = [8];
        if (allowedKeys.indexOf(code) !== -1) {
            return;
        }

        event.target.value = event.target.value.replace(
            /^([1-9]\/|[2-9])$/g, '0$1/'
        ).replace(
            /^(0[1-9]|1[0-2])$/g, '$1/'
        ).replace(
            /^([0-1])([3-9])$/g, '0$1/$2'
        ).replace(
            /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2'
        ).replace(
            /^([0]+)\/|[0]+$/g, '0'
        ).replace(
            /[^\d\/]|^[\/]*$/g, ''
        ).replace(
            /\/\//g, '/'
        );

    };
    
    // add spaces every 4 digits
    const handleCardOnKeyUp = (e) => {
        var inputChar = String.fromCharCode(event.keyCode);
        var code = event.code;
        var allowedKeys = [8, "Backspace"];
        if (allowedKeys.indexOf(code) !== -1) {
            return;
        }

        event.target.value = event.target.value
            .replace(/\s/g, '')
            .split('')
            .map((number, index) => {
                if (index % 4 === 3 && index > 0)
                    return number.concat(' ')
                else
                    return number;
            }).join('');
    };

    // handle validation of credit card section and proceed to next section
    const handleNext = async () => {
        const isValid = validateCC();
        if (isValid)
            setSectionToShow(1);
    }  
    
    // handle back to previous section
    const handlePrev = () => {
        setSectionToShow(0);
    }

    // handle validation of address section and unlock pay button
    const handleToPayment = async () => {
        const isValid = validateAddress();
        if (isValid)
            setPaymentAllowed(true)
    }
    
    // handle form submission: show spin, post form, stop spin & show result
    const handleOnSubmit = async (e) => {
        passLoadingStatus(true);
        e.preventDefault();

        // POST request to server
        // potentially add api key here
        const valuesToSubmit = {
            amount,
            currency,
            first_name: values.first_name,
            last_name: values.last_name,
            address: values.address,
            country: values.countryAlpha2,
            state: values.state,
            city: values.city,
            zip: values.zip,
            email: values.email,
            phone_no: String(values.callingCode) + String(values.phone),
            card_no: values.card_no,
            ccExpiryMonth: values.ccExpiryMonth,
            ccExpiryYear: "20" + String(values.ccExpiryYear),
            cvvNumber: values.cvvNumber,
        };            
        const url = sandbox ? process.env.URL_SANDBOX : process.env.URL_PRODUCTION;
        const options = {
            method: "POST", 
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(valuesToSubmit)
        }
        const response = await fetch(url, options);
        const data = await response.json();
        
        // callback to parent window 
        window.xprops.onResult(data);

        // show result in iframe in case parent window reacts slowly
        if (data.responseCode == 1) {
            setPaymentStatus("Payment approved");
        } else {
            setPaymentStatus("Payment Incomplete/Failed");
        }
        passLoadingStatus(false);
        console.log("payment response", data.responseCode, data.responseMessage);
    }


    return (               
        <>
            {paymentStatus ? (
                <Result>{paymentStatus}</Result>
            ) : (               
                <CustomForm onSubmit={(e) => handleOnSubmit(e)}>
                    <FormHeader>
                        <HeaderText>PAY WITH CARD {sandbox ? "- SANDBOX" : ""}</HeaderText>
                        <Price>{amount}{" "}{currency}</Price>
                    </FormHeader>
                    <MerchantInfo>
                        <MerchantText>{merchantText}</MerchantText>
                    </MerchantInfo>
                    <>  
                        {sectionToShow === 0 ? (
                            <>                                            
                                <Item>
                                    <Input type="text"
                                        placeholder="1234 1234 1234 1234" 
                                        name="card_no"
                                        value={values.card_no}
                                        onChange={handleChange}
                                        onKeyUp={handleCardOnKeyUp}
                                        error={validationErrors.card_no}
                                    />
                                </Item>      
                                <Item>
                                    <Input type="text"
                                        placeholder="MM / YY"
                                        name="expiration"
                                        //value={values.ccExpiration} errors in combination with onKeyUp+onChange
                                        maxLength="5"
                                        onChange={handleChange}
                                        onKeyUp={handleExpirationOnKeyUp}
                                        error={validationErrors.expiration}
                                    />                                        
                                    <Input type="number"
                                        placeholder="CVV" 
                                        name="cvvNumber" 
                                        value={values.cvvNumber}
                                        onChange={handleChange}
                                        error={validationErrors.cvvNumber}
                                    />  
                                </Item>
                                <Item>
                                    <Input type="text" 
                                        placeholder="First name" 
                                        name="first_name" 
                                        value={values.first_name} 
                                        onChange={handleChange} 
                                        error={validationErrors.first_name}
                                    />
                                </Item>
                                <Item>
                                    <Input type="text" 
                                        placeholder="Last name" 
                                        name="last_name" 
                                        value={values.last_name} 
                                        onChange={handleChange} 
                                        error={validationErrors.last_name}
                                    />
                                </Item>
                                <Item>
                                    <Input type="text"
                                        placeholder="Zip"
                                        name="zip"
                                        value={values.zip}
                                        onChange={handleChange}
                                        error={validationErrors.zip}
                                    />              
                                </Item>
                                <Errors>
                                    <>
                                        {(validationErrors.card_no || 
                                        validationErrors.expiration ||
                                        validationErrors.cvvNumber ||
                                        validationErrors.first_name || 
                                        validationErrors.last_name ||
                                        validationErrors.zip) && 
                                            <Error>Invalid or missing fields. Please review.</Error>
                                        }
                                    </>                
                                </Errors>
                                <Item>
                                    <PrimaryButton type="button" onClick={() => handleNext()}>Next</PrimaryButton>  
                                </Item>
                            </>
                        ) : (
                            <>
                                <Item>
                                    <Input type="text"
                                        placeholder="Address" 
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        error={validationErrors.address}
                                        readOnly={paymentAllowed}
                                    />
                                </Item>
                                <Item>
                                    <CustomSelect 
                                        placeholder="Country"
                                        name="country"
                                        value={values.country.length > 0 ? {label: values.country} : undefined}
                                        options={selectCountryArray}
                                        onChange={handleCountryChange}
                                        error={validationErrors.country}
                                        classNamePrefix="Select"
                                        isSearchable="true"
                                        noOptionsMessage={(input) => `That is not a real country.`}
                                    />
                                </Item>
                                <Item>
                                    <Input type="text"
                                        placeholder="State" 
                                        name="state"
                                        value={values.state}
                                        onChange={handleChange}
                                        error={validationErrors.state}
                                        readOnly={paymentAllowed}
                                    />
                                    <Input type="text"
                                        placeholder="City" 
                                        name="city"
                                        value={values.city}
                                        onChange={handleChange}
                                        error={validationErrors.city}
                                        readOnly={paymentAllowed}
                                    /> 
                                </Item>
                                <Item>
                                    <Input type="text"
                                        placeholder="Email" 
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        error={validationErrors.email}
                                        readOnly={paymentAllowed}
                                    />
                                </Item>
                                <Item>
                                    <PrefixInput
                                        type="text"
                                        placeholder="+ ..."
                                        name="callingCode"
                                        onChange={handleChange}
                                        error={validationErrors.callingCode}                                                    
                                        defaultValue={values.callingCode}
                                        readOnly={paymentAllowed}
                                    />
                                    <Input type="text"
                                        placeholder="Phone" 
                                        name="phone"
                                        value={values.phone}
                                        onChange={handleChange}
                                        error={validationErrors.phone}
                                        readOnly={paymentAllowed}
                                    />
                                </Item> 

                                <Errors>
                                    <>
                                        {(validationErrors.address || 
                                        validationErrors.country ||
                                        validationErrors.state ||
                                        validationErrors.city || 
                                        validationErrors.email ||
                                        validationErrors.phone) && 
                                            <Error>Invalid or missing fields. Please review.</Error>
                                        }
                                    </>                
                                </Errors>           
                                <Item>
                                    <>
                                        {paymentAllowed ? (
                                            <PrimaryButton type="submit">Pay</PrimaryButton>
                                        ) : (
                                            <>
                                                <PrimaryButton type="button" onClick={() => handlePrev()}>Prev</PrimaryButton>
                                                <PrimaryButton type="button" onClick={() => handleToPayment()}>Next</PrimaryButton>
                                            </>
                                        )}
                                    </>
                                </Item>
                            </>
                        )}
                    </>
                </CustomForm>
            )}
        </>
    );
}

Form.defaultProps = {
    onResult: data => {
        console.log(data);
    },
    passLoadingStatus: status => {
        console.log(status);
    },
    amount: 3.33,
    currency: "USD",
    sandbox: true,
    merchantText: "Custom merchant text shows up here"
};

Form.propTypes = {
    onResult: PropTypes.func,
    passLoadingStatus: PropTypes.func,
    amount: PropTypes.number,
    currency: PropTypes.string,
    sandbox: PropTypes.bool, 
    merchantText: PropTypes.string
};

export default Form;