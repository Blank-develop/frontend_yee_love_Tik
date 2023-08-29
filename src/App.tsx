import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import HomePage02 from './pages/HomePage02';
import Welcome from './pages/Welcome';
import ResultPage from './pages/ResultPage';
import Dashbord from './pages/Dashbord';
import HistoryPage from './pages/HistoryPage';
import DetailPage from './pages/DetailPage';
import Scrollab from './components/Scrollab';
import TestApi from './pages/testapi';

import axios from 'axios';

function App() {
  // Client ID from Google API
  const clientId = '72831622081-thqra06krh8p7murespj7d3raettjdfk.apps.googleusercontent.com';
  const [loggedIn, setLoggedIn] = useState(false);
  const Loginstate = localStorage.getItem('userEmail');

  return (
 
    <div>
      <header>

      </header>
      <BrowserRouter>
        <div>
          <Scrollab/>
          <Routes>

            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />} />

            {Loginstate ? (
              <>
            <Route path="/test" element={<TestApi />} />

            <Route path="/history/detail" element={<DetailPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/home/2" element={<HomePage02 />} />
            <Route path="/dash" element={<Dashbord />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/myprofile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/login" />} />
            </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} /> 
              )}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );

}

export default App;
