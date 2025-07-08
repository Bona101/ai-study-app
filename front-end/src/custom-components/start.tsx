// src/App.tsx
import React, { type FC } from 'react';
// import Navbar from './navbar';
// import './App.css';

const Start: FC = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <div style={{ padding: '2rem' }}>
        <h1>Welcome to the Gemini Chat App!</h1>
        <p>This is the main application area.</p>
        <p>You can upload files and interact with Gemini here once you're logged in.</p>
        <p>Use the navigation bar to Login, Signup, or visit the protected Dashboard.</p>
        {/* Your existing Gemini chat UI will go here */}
      </div>
    </div>
  );
};

export default Start;