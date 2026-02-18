import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from '../../hooks/useGlobalReducer.jsx';
import { signup } from '../../action.js';

export const SignupForm = () => {
  const { dispatch } = useGlobalReducer();
  const [emailAddress, setEmailAddress] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmUserPassword, setConfirmUserPassword] = useState('');
  const [arePasswordsVisible, setArePasswordsVisible] = useState(false);
  const navigate = useNavigate();

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    if (userPassword !== confirmUserPassword) {
      alert("Passwords do not match");
      return;
    }
    const dataToSend = {
      email: emailAddress,
      first_name: userFirstName,
      password: userPassword,
      is_active: true
    };
    const result = await signup(dispatch, dataToSend);
    if (!result) {
      resetSignupForm();
      return;
    }
    localStorage.setItem("access_token", result.access_token)
    dispatch({
      type: "HANDLE_TOKEN",
      payload: result.access_token
    })
    navigate("/dashboard");
  };

  const resetSignupForm = () => {
    setEmailAddress('');
    setUserFirstName('');
    setUserPassword('');
    setConfirmUserPassword('');
    setArePasswordsVisible(false);
  };

  return (
    <form onSubmit={handleSignupSubmit}>
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
        <label className="form-label auth-label">First Name</label>
        <input
          type="text"
          className="form-control star-wars-input"
          value={userFirstName}
          onChange={(event) => setUserFirstName(event.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label auth-label">Password</label>
        <input
          type={arePasswordsVisible ? 'text' : 'password'}
          className="form-control star-wars-input"
          value={userPassword}
          onChange={(event) => setUserPassword(event.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label auth-label">Confirm Password</label>
        <input
          type={arePasswordsVisible ? 'text' : 'password'}
          className="form-control star-wars-input"
          value={confirmUserPassword}
          onChange={(event) => setConfirmUserPassword(event.target.value)}
          required
        />
        <button
          type="button"
          className="btn btn-link auth-link"
          onClick={() => setArePasswordsVisible(!arePasswordsVisible)}
        >
          {arePasswordsVisible ? 'Hide' : 'Show'} Passwords
        </button>
      </div>

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
