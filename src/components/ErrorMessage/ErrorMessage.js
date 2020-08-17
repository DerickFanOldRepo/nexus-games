import React from "react";
import "./ErrorMessage.css";

const ErrorMessage = (props) => {
    return (
        <div className="error-message">
            <p className="error-text">{props.error}</p>
        </div>
    );
};

export default ErrorMessage;
