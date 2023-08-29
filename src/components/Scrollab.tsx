import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import './Scrollab.css';
import LanguageButton from './LanguageChange';
import { List } from '@mui/material';

const Scrollab: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [value, setValue] = useState(0);
  const clientId = '936930992538-6pkkdh1hf45lacko0scjo0oh2gtc3jam.apps.googleusercontent.com';

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: '',
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const onSuccess = (res: any) => {
    setProfile(res.profileObj);
    console.log('success', res);
  };

  const logOut = () => {
    setProfile(null);
  };

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <nav className="navbar">
      <div className="max-width">


        <ul className="menu">


          <div className='left-nav'>
            {/* <li className="left-item menu-btn"><LanguageButton /></li> */}

            <li className="left-item menu-btn">
              <Link to="/welcome">
                <img
                  className='new-work-logo-01'
                  src="/logo/new-work-logo.png"
                  alt="Logo"
                  style={{ width: '150px', height: 'auto' }} // Adjust the size as needed
                />
              </Link>
            </li>

          </div>


          <div className='rigth-nav'>
            <li className="menu-btn"><Link to="/home">
              <img className='icon-home-page' src="/icon/icon-home.png" alt="Logo" />
            </Link></li>

            <li className="menu-btn"> <Link to="/history">
              <img className='icon-history-page' src="/icon/icon-history.png" alt="Notification Bell" />
            </Link></li>

            {/* <li className="menu-btn"><Link to="/about">
              <img className='icon-people-page' src="/icon/people.png" alt="About page" />
            </Link></li> */}

            <li className="menu-btn left-nav"> {profile && profile.imageUrl ? (
              <div>
                <button className='none-bg'>
                  <Link style={{ textDecoration: 'none' }} className='none-bg' to="/myprofile">
                    <div className="container-profile">
                      <img className='img-profile-user' src={profile.imageUrl} alt='user profile' />
      
                    </div>
                  </Link>
                </button>
              </div>
            ) : (
              <GoogleLogin
                clientId={clientId}
                buttonText="."
                onSuccess={onSuccess}
                className='btn-google'
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
              />
            )}
              <br />

              {!profile && (
                <div className="container-profile-login">
                  <img className="img-profile-user" src="/icon/user.png" alt="User icon" />
                  <h2 className="text-email-user">Username</h2>
                </div>
              )}</li>
          </div>
        </ul>
      </div>

    </nav>
  );
};

export default Scrollab;
