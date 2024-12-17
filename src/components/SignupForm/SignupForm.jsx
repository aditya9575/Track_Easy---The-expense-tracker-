import React, { useState } from "react";
import axios from "axios";
import "./signup.css";
import { useNavigate } from "react-router-dom";

const FirebaseSignup_Url = import.meta.env.VITE_FireBaseSignup_URL

const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    const handleSignupForm = async (e) => {
        e.preventDefault();

        // Form validation
        if (!email.includes('@')) {
            setErrorMessage("Invalid email address.");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        // Reset error message
        setErrorMessage("");

        // Form data
        const formData = {
            email,
            password,
            returnSecureToken: true
        };

        try {
            const response = await axios.post(
                FirebaseSignup_Url,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log("User has successfully signed up.", response.data);
            setSuccessMessage("Signup successful!");
            navigate("/loginForm")

            // Reset form fields
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error signing up:", error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error.message);
            } else {
                setErrorMessage("Signup failed. Please try again.");
            }
        }
    };

    return (
        <form className="track-easy-signup-form" onSubmit={handleSignupForm}>
            <h1 className="track-easy-signup-title">Track Easy Signup</h1>
            <div className="track-easy-input-group">
                <input
                    className="track-easy-input track-easy-email-input"
                    type="email"
                    required
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="track-easy-input track-easy-password-input"
                    type="password"
                    required
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className="track-easy-input track-easy-confirm-password-input"
                    type="password"
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            {errorMessage && <p className="track-easy-error-message">{errorMessage}</p>}
            {successMessage && <p className="track-easy-success-message">{successMessage}</p>}
            <div className="track-easy-button-group">
                <button
                    className="track-easy-btn track-easy-signup-btn"
                    type="submit"
                >
                    Signup
                </button>
                <button
                    className="track-easy-btn track-easy-login-redirect-btn"
                    type="button"
                    onClick={() => {
                        navigate("/loginForm")
                    }}
                >
                    Have an account? Login
                </button>
            </div>
        </form>
    );
};

export default SignupForm;