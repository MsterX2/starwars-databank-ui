import React, { useState } from 'react';

export const ResetPasswordForm = ({ onBack }) => {
    const [emailAddress, setEmailAddress] = useState('');

    const handleResetPasswordSubmit = (event) => {
        event.preventDefault();
        console.log({
            email: emailAddress,
        });
    };

    return (
        <form onSubmit={handleResetPasswordSubmit}>
            <input
                type="email"
                className="form-control star-wars-input mb-4"
                placeholder="Enter your email address"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                required
            />

            <button type="submit" className="btn star-wars-button w-100 mb-3">
                Send Reset Link
            </button>

            <button
                type="button"
                className="btn star-wars-button-secondary w-100"
                onClick={onBack}
            >
                Back to Login
            </button>
        </form>
    );
};
