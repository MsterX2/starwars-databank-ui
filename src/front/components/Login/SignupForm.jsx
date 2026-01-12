import React, { useState } from 'react';

export const SignupForm = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmUserPassword, setConfirmUserPassword] = useState('');
  const [arePasswordsVisible, setArePasswordsVisible] = useState(false);

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    console.log({
      email: emailAddress,
      password: userPassword,
      confirmPassword: confirmUserPassword,
    });
  };

  const resetSignupForm = () => {
    setEmailAddress('');
    setUserPassword('');
    setConfirmUserPassword('');
    setArePasswordsVisible(false);
  };

  return (
    <form onSubmit={handleSignupSubmit}>
      <input
        type="email"
        className="form-control star-wars-input mb-3"
        placeholder="Email Address"
        value={emailAddress}
        onChange={(event) => setEmailAddress(event.target.value)}
        required
      />

      <input
        type={arePasswordsVisible ? 'text' : 'password'}
        className="form-control star-wars-input mb-3"
        placeholder="Password"
        value={userPassword}
        onChange={(event) => setUserPassword(event.target.value)}
        required
      />

      <input
        type={arePasswordsVisible ? 'text' : 'password'}
        className="form-control star-wars-input mb-3"
        placeholder="Confirm Password"
        value={confirmUserPassword}
        onChange={(event) => setConfirmUserPassword(event.target.value)}
        required
      />

      <button
        type="button"
        className="btn btn-link auth-link mb-3"
        onClick={() => setArePasswordsVisible(!arePasswordsVisible)}
      >
        {arePasswordsVisible ? 'Hide' : 'Show'} Passwords
      </button>

      <div className="d-flex gap-2">
        <button type="submit" className="btn star-wars-button flex-fill">
          Join the Force
        </button>
        <button
          type="button"
          className="btn star-wars-button-reset"
          onClick={resetSignupForm}
          title="Clear form"
        >
          <i className="fas fa-redo"></i>
        </button>
      </div>
    </form>
  );
};
