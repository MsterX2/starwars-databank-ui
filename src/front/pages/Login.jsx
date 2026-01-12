import React, { useState } from 'react';
import '../login.css';
import { LoginForm } from '../components/Login/LoginForm';
import { SignupForm } from '../components/Login/SignupForm';
import { ResetPasswordForm } from '../components/Login/ResetPasswordForm';

export const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showReset, setShowReset] = useState(false);

    return (
        <div className="auth-container">
            <div className="container">
                <div className="row justify-content-center align-items-center min-vh-100 py-5">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                        <div className="star-wars-card auth-card">

                            <div className="auth-header text-center p-4">
                                <h1 className="star-wars-title mb-3">
                                    <i className="fas fa-jedi me-3"></i>
                                    STAR WARS
                                    <i className="fas fa-jedi ms-3"></i>
                                </h1>
                                <p className="auth-subtitle mb-0">
                                    {showReset
                                        ? 'Reset Your Access'
                                        : isLogin
                                            ? 'Access The Galaxy'
                                            : 'Join The Force'}
                                </p>
                            </div>

                            <div className="auth-body p-4">
                                {showReset ? (
                                    <ResetPasswordForm onBack={() => setShowReset(false)} />
                                ) : (
                                    <>
                                        <div className="auth-toggle mb-4">
                                            <button
                                                className={`btn auth-toggle-btn ${isLogin ? 'active' : ''}`}
                                                onClick={() => setIsLogin(true)}
                                            >
                                                Login
                                            </button>
                                            <button
                                                className={`btn auth-toggle-btn ${!isLogin ? 'active' : ''}`}
                                                onClick={() => setIsLogin(false)}
                                            >
                                                Sign Up
                                            </button>
                                        </div>

                                        {isLogin ? (
                                            <LoginForm onForgotPassword={() => setShowReset(true)} />
                                        ) : (
                                            <SignupForm />
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="auth-footer text-center p-3">
                                May the Force be with you
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
