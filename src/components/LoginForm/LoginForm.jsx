import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Firebaselogin_Url = import.meta.env.VITE_FireBaseLogin_URL;

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleUserLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loginData = {
            email,
            password,
            returnSecureToken: true,
        };

        try {
            const response = await axios.post(
                Firebaselogin_Url,
                loginData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const { idToken, localId } = response.data;

            console.log("User has successfully logged in.", response.data);

            // Store token and userId in localStorage
            localStorage.setItem("authToken", idToken);
            localStorage.setItem("userId", localId);

            // Trigger navigation and reload the page
            navigate("/Homepage"); // Use replace to avoid adding to history stack
            window.location.reload(); // Force a reload of the page after navigation

        } catch (error) {
            console.error("Error in logging in:", error);
            setErrorMessage(error.response?.data?.error?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }

        setEmail("");
        setPassword("");
    };

    return (
        <form onSubmit={handleUserLogin} className="track-easy-login-form">
            <h1 className="track-easy-login-title">Track Easy Login</h1>
            <div className="track-easy-input-group">
                <input
                    className="track-easy-input track-easy-email-input"
                    type="email"
                    required
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="track-easy-input track-easy-password-input"
                    type="password"
                    required
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {errorMessage && <p className="track-easy-error-message">{errorMessage}</p>}
            <div className="track-easy-button-group">
                <button
                    className="track-easy-btn track-easy-submit-btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <button
                    className="track-easy-btn track-easy-signup-btn"
                    type="button"
                    onClick={() => {
                        navigate("/SignupForm");
                    }}
                >
                    Don't Have An Account
                </button>
                <button
                    className="track-easy-btn track-easy-forgot-password-btn"
                    type="button"
                    onClick={() => {
                        navigate("/ForgotPassword");
                    }}
                >
                    Forgot Password
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
