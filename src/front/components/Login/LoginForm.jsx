import React, { useState } from 'react';

export const LoginForm = ({ onForgotPassword }) => {
    const [emailAddress, setEmailAddress] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        console.log({
            email: emailAddress,
            password: userPassword,
        });
    };

    const resetLoginForm = () => {
        setEmailAddress('');
        setUserPassword('');
        setIsPasswordVisible(false);
    };

    return (
        <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
                <label className="form-label auth-label">Email Address</label>
                <input
                    type="email"
                    className="form-control star-wars-input"
                    value={emailAddress}
                    onChange={(event) => setEmailAddress(event.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="form-label auth-label">Password</label>
                <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    className="form-control star-wars-input"
                    value={userPassword}
                    onChange={(event) => setUserPassword(event.target.value)}
                    required
                />
                <button
                    type="button"
                    className="btn btn-link auth-link"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    {isPasswordVisible ? 'Hide' : 'Show'} Password
                </button>
            </div>

            <div className="text-end mb-3">
                <button
                    type="button"
                    className="btn btn-link auth-link"
                    onClick={onForgotPassword}
                >
                    Forgot Password?
                </button>
            </div>

            <div className="d-flex gap-2">
                <button type="submit" className="btn star-wars-button flex-fill">
                    Login
                </button>
                <button
                    type="button"
                    className="btn star-wars-button-reset"
                    onClick={resetLoginForm}
                    title="Clear form"
                >
                    <i className="fas fa-redo"></i>
                </button>
            </div>
        </form>
    );
};
