import React from "react";
import "./ErrorMessage.css";

const ErrorMessage = (props) => {
    return (
        <div className="error-message">
            <p className="error-text">{props.error}</p>
            <button onClick={() => props.setError()}>ok</button>
        </div>
    );
};

export default ErrorMessage;
