import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./forgotpassword.css";


const FirebaseForgotPasswordUrl = import.meta.env.VITE_ForgotPassword_URL

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState(null);

    const handleForgotPassword = async () => {
        try {
            setLoader(true);

            const requestData = {
                requestType: 'PASSWORD_RESET',
                email: email,
            };

            await axios.post(
                FirebaseForgotPasswordUrl,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            setLoader(false);
            setMessage('Password reset link sent successfully. Check your email.');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            setLoader(false);
            if (error.response && error.response.data && error.response.data.error) {
                setMessage(`Error: ${error.response.data.error.message}`);
            } else {
                setMessage('Failed to send password reset email. Please try again.');
            }
        }
    };

    return (
        <div className="track-easy-forgot-password-container">
            {loader ? (
                <div className="track-easy-loader">
                    <h2 className="track-easy-loader-text">Loading...</h2>
                </div>
            ) : (
                <form className="track-easy-forgot-password-form">
                    <div className="track-easy-form-header">
                        <button
                            className="track-easy-btn track-easy-go-back-btn"
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </button>
                        <h1 className="track-easy-form-title">Forgot Password</h1>
                    </div>

                    <div className="track-easy-input-group">
                        <input
                            className="track-easy-input track-easy-email-input"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="track-easy-button-group">
                        <button
                            className="track-easy-btn track-easy-reset-btn"
                            type="button"
                            onClick={handleForgotPassword}
                        >
                            Send Password Reset Link
                        </button>
                    </div>

                    {message && (
                        <p className={`track-easy-message ${message.includes('Error')
                            ? 'track-easy-error-message'
                            : 'track-easy-success-message'}`}
                        >
                            {message}
                        </p>
                    )}
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;
