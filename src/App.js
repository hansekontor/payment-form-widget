import React, { useState } from 'react';
import styled from 'styled-components';
import Form from './components/Form';

const CustomApp = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;

   @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
   }
`;
const FormBody = styled.div`
   width: 100%;
   max-width: 480px;
   position: relative;
   top: 0;
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 15px 5px; 5px;
`;
const SpinOverlay = styled.div`
    position: fixed;
    background-color: grey;
    height: 100vh;
    width: 100vh;
    opacity: .5;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Spin = styled.div`
    width: 50px;
    height: 50px;
    border: 3px solid #000000;
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;            
`;

const  App = () => {
   const [spin, setSpin] = useState(false);
   
   return (
      <CustomApp>
         <FormBody>
            {spin && <SpinOverlay><Spin /></SpinOverlay>}
            <Form 
               passLoadingStatus={setSpin}
               {...window.xprops}/>
         </FormBody>
      </CustomApp>
   );
}

export default App;