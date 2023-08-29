// components/AboutPage.tsx
import React from 'react';
import './css/AboutPage.css'

const AboutPage: React.FC = () => {
  return (
    <div className='contianer-about'>

        <center>
          <br /><br />
          <h1>Our Team</h1>
          <br /><br />

          <div className='contianer-content'>
          <div className='content-profile'>
            <img className='img-profile-about' src="/Profile/YEE-profile-crop.jpg" alt="Profile" />
            <br /><br /><br />
            <hr /><br />
            <h3 className='text-content-about'>Mr: Yee</h3>
            <p className='text-content-about-h1'>DATABASE</p>
          </div>
          <div className='content-profile'>
            <img className='img-profile-about' src="/Profile/BANK-profile-crop.jpg" alt="Profile" />
            <br /><br /><br />
            <hr /><br />
            <h3 className='text-content-about'>Mr: bank </h3>
            <p className='text-content-about-h1'>POC-GMAIL AND UXUI</p>
          </div>
          <div className='content-profile'>
            <img className='img-profile-about' src="/Profile/TICK-profile-crop.jpg" alt="Profile" />
            <br /><br /><br />
            <hr /><br />
            <h3 className='text-content-about'>Mr: Tick </h3>
            <p className='text-content-about-h1'>FRONT-END</p>
          </div>
          </div>
        </center>
      </div>
  );
};

export default AboutPage;
