import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './css/HomePage.css';

type Character = {
  id: number;
  choiceEn: string;
  choiceTh: string;
  categoryId: string;
};

const HomePage2: React.FC = () => {
  const [characterData, setCharacterData] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<{ id: number; categoryId: string; choiceTh: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/choice')  // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => {
        setCharacterData(shuffleArray(data));
      });
  }, []);

  const shuffleArray = (array: Character[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };



  //selection manage
  const handleCharacterSelection = (characterId: number, categoryId: string, choiceTh: string) => {
    setSelectedCharacters((prevSelected) => {
      if (prevSelected.some((character) => character.id === characterId)) {
        return prevSelected.filter((character) => character.id !== characterId);
      } else {
        if (prevSelected.length < 5) {
          return [...prevSelected, { id: characterId, categoryId, choiceTh }];
        } else {
          return prevSelected;
        }
      }
    });
  };

  const SelectedSuccess = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'Selected 5 items. Click Result below.',
    });
  };

  useEffect(() => {
    if (selectedCharacters.length === 5) {
      SelectedSuccess();
    }
  }, [selectedCharacters]);

  const handleNavigation = () => {
    if (selectedCharacters.length < 5) {
      Swal.fire('Warning', 'Please select 5 choices before proceeding.', 'warning');
    } else {
      const queryParams = selectedCharacters.map((character) => `character=${character.id}`).join('&');
      navigate(`/result`);
    }
  };

  const handlePrevious = () => {
    navigate('/home');
  };

  useEffect(() => {
    const storedLeastAnimal = localStorage.getItem('leastAnimal');
    if (storedLeastAnimal) {
      setSelectedCharacters(JSON.parse(storedLeastAnimal));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('leastAnimal', JSON.stringify(selectedCharacters));
  }, [selectedCharacters]);

  //change language
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  return (
    <>
      {selectedLanguage === 'en' ? (
        <div className="container">
          <div>
            <center>
              <br />
              <br />
              <p className="text-01-home">
                {characterData.length === 0 ? (
                  <strong>Loading...</strong>
                ) : (
                  "Select 10 descriptions that you consider least like you"
                )}
              </p>
              <br />

              <div className="item-container">
              <p className="selected-count">Choose: {selectedCharacters.length}</p>
                {characterData.map((character) => (
                  <div className="item-wrapper" key={character.id}>
                    <button
                      className={`item-least ${selectedCharacters.some((c) => c.id === character.id) ? 'checked-least' : 'default'}`}
                      onClick={() => handleCharacterSelection(character.id, character.categoryId, character.choiceTh)}
                    >
                      {character.choiceEn}
                    </button>
                  </div>
                ))}
              </div>
              <br />
            </center>
          </div>
          <footer className="div-button-next">
          <button className="button-previous" onClick={handlePrevious}>
              <strong>Previous</strong>
            </button>
            <button className="button-next" onClick={handleNavigation}><strong>Next ➤</strong></button>
          </footer>
        </div>
      ) : (
        <div>

          <div>
            <center>
              <br />
              <br />
              <p className="text-01-home">เลือก 5 อย่างที่ <strong>ไม่ใช่ตัวคุณ</strong></p>
              <br />

              <div className="item-container">
                {characterData.map((character) => (
                  <div className="item-wrapper" key={character.id}>
                    <button
                      className={`item-least ${selectedCharacters.some((c) => c.id === character.id) ? 'checked-least' : 'default'}`}
                      onClick={() => handleCharacterSelection(character.id, character.categoryId, character.choiceTh)}
                    >
                      {character.choiceTh}
                    </button>
                  </div>
                ))}
              </div>
              <br />
            </center>
          </div>
          <footer className="div-button-next">
            <button className="button-previous" onClick={handlePrevious}>
              <strong>ก่อนหน้า</strong>
            </button>
            <button className="button-next" onClick={handleNavigation}><strong>ต่อไป ➤</strong></button>
          </footer>
        </div>
      )}

    </>
  );
};

export default HomePage2;
