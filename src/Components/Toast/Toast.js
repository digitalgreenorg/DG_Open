
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
function Toast(props) {

    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
            />
        </>
    );
}
export default Toast;