import React, { useState } from "react";
import { LoginSocialFacebook } from "reactjs-social-login";
import './Facebook.css'

function FacebookLoginButton() {
  const [profile, setProfile] = useState<any>(null);

  const handleLoginSuccess = (response: any) => {
    console.log(response);
    setProfile(response.profile);
  };

  const handleLoginFailure = (error: any) => {
    console.log(error);
  };

  return (
    <div>
      {!profile ? (
        <LoginSocialFacebook
          appId="307126838495808" 
          onResolve={handleLoginSuccess}
          onReject={handleLoginFailure}
        >
          <button className="fb-button">
            <img className="fb-icon" src="/icon/Facebook_Logo.png"/>
            <p className="text-in-btn">Login with Facebook</p>
            </button>
        </LoginSocialFacebook>
      ) : (
        ""
      )}

      {profile ? (
        <div>
          <h1>{profile.name}</h1>
          <img src={profile.picture.data.url} alt={profile.name} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FacebookLoginButton;
