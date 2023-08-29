import React from 'react';
import './LanguageChange.css';

function LanguageButton() {
    const getDefaultLanguage = () => {
      const storedLanguage = localStorage.getItem('selectedLanguage');
      return storedLanguage || 'en'; 
    };
  
    const changeLanguage = (lng: string) => {
      localStorage.setItem('selectedLanguage', lng);
      window.location.reload();
    };
  
    return (
      <div className="language-dropdown">
        <button className="dropdown-button">
          <img className="flag-icon" src="/icon/icon-change-lang.png" alt="Language Selector" />
        </button>
        <div className="dropdown-content">
          <button className='btn-en' onClick={() => changeLanguage('en')}>
            <img className='icon-flag-content' src="/icon/icon-English.png" alt="English Flag" />
            English
          </button>
          <button className='btn-th' onClick={() => changeLanguage('th')}>
            <img className='icon-flag-content' src="/icon/icon-Thailand.png" alt="Thai Flag" />
            ภาษาไทย
          </button>
        </div>
      </div>
    );
  };

export default LanguageButton;
