import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export const GoogleAuth = () => {
    return (
        <GoogleOAuthProvider clientId="249431108114-gbv8cniho9utvspi8nhqdpc3f3j51d7g.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={(response) => console.log("Success:", response)}

                onError={() => console.log("Login Failed")}
            />
        </GoogleOAuthProvider>
    );
};
