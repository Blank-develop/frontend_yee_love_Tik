import React, { useEffect, useState } from 'react';
import './css/ResultPage.css';
import { type } from 'os';
import axios from 'axios';
import Confetti from 'react-confetti';
interface CategoryData {
  id: number;
  categoryNameTh: string | null;
  categoryNameEn: string | null;
  description_th: string;
  description_en: string;
  choiceEntities: any;
  historyEntities: any;
}

const ResultPage: React.FC = () => {
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ animal: string; percentage: number } | null>(null);
  const [mostAnimalDescriptions, setMostAnimalDescriptions] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);



  const [SaveStatus, setSaveStatus] = useState(false);

  interface Animal {
    id: number;
    categoryId: number;
    choiceTh: string;
  }

  const sendHistoryDataToAPI = async (categoryId: number, userEmail: string) => {
    const apiUrl = 'http://127.0.0.1:8080/api/post/history';
    const requestBody = {
      categoryId,
      userEmail,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log('History data sent successfully to the API.');
      } else {
        console.error('Failed to send history data to the API.');
      }
    } catch (error) {
      console.error('An error occurred while sending history data:', error);
    }
  };



  useEffect(() => {
    const mostAnimalData = localStorage.getItem('mostAnimal');
    const leastAnimalData = localStorage.getItem('leastAnimal');

    if (mostAnimalData && leastAnimalData) {
      const mostAnimalCounts = countAnimalTypes(JSON.parse(mostAnimalData));
      const leastAnimalCounts = countAnimalTypes(JSON.parse(leastAnimalData));


      const differences: { [key: string]: number } = {};
      Object.keys(mostAnimalCounts).forEach((animal) => {
        differences[animal] = mostAnimalCounts[animal] - leastAnimalCounts[animal];
      });

      const mostSignificantAnimal = Object.keys(differences).reduce((a, b) =>
        differences[a] > differences[b] ? a : b
      );

      setResult({
        animal: mostSignificantAnimal,
        percentage: differences[mostSignificantAnimal],
      });

      const mostAnimalDataArray = JSON.parse(mostAnimalData);
      const mostAnimalDescriptionsArray = mostAnimalDataArray
        .filter((animal: { animal: string }) => animal.animal === mostSignificantAnimal)
        .map((animal: { choiceTh: any }) => animal.choiceTh);
      setMostAnimalDescriptions(mostAnimalDescriptionsArray);

      setShowResult(true);

    } else {
      console.error('Animal data not found in localStorage.');
    }


    setLoading(false);
  }, []);

  useEffect(() => {
    if (showResult && result) {
      const mostSignificantAnimal = result.animal.toLowerCase();
      const categoryToAnimal: { [key: string]: number } = {
        cow: 1,
        rat: 2,
        bear: 3,
        eagle: 4,
      };
      const categoryId = categoryToAnimal[mostSignificantAnimal];

      if (categoryId) {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          sendHistoryDataToAPI(categoryId, userEmail);

          const delayTimeout = setTimeout(() => {
            handleSendDataDetail();
            setIsVisible(true);
            fetchCategoryData(categoryId);
          }, 1000)
        } else {
          console.error('User email not found in localStorage.');
        }
      } else {
        console.error('Category ID not found for the most significant animal.');
      }
    }
  }, [showResult, result]);



  const countAnimalTypes = (animalData: any[]) => {
    const counts: { [key: string]: number } = {
      cow: 0,
      rat: 0,
      bear: 0,
      eagle: 0,
    };

    const categoryToAnimal: { [key: number]: string } = {
      1: 'cow',
      2: 'rat',
      3: 'bear',
      4: 'eagle',
    };

    animalData.forEach((animal) => {
      const animalCategory = categoryToAnimal[animal.categoryId];
      if (animalCategory) {
        counts[animalCategory]++;
      }
    });

    return counts;
  };

  const mostAnimalData: Animal[] = JSON.parse(localStorage.getItem('mostAnimal') || '[]');
  const leastAnimalData: Animal[] = JSON.parse(localStorage.getItem('leastAnimal') || '[]');

  const countChoice: Animal[] = [...mostAnimalData, ...leastAnimalData];

  const postToApi = async (data: any) => {
    const apiUrl = 'http://localhost:8080/api/post/history/detail';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Data sent detail successfully.');
      } else {
        console.error('Error sending data detail.');
      }
    } catch (error) {
      console.error('An error occurred detail:', error);
    }
  };

  const handleSendDataDetail = () => {
    postToApi(countChoice.map(item => ({ choiceId: item.id })));
  };
  console.log(countChoice);

  //show desription
  const Desription = localStorage.getItem('userData');
  if (Desription) {
    const userData = JSON.parse(Desription);
    console.log(userData.choiceTh);
  } else {
    console.log('No data found in localStorage.');
  }

  //fetch data description
  const fetchCategoryData = async (categoryId: number) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/get/description?categoryId=${categoryId}`);
      setCategoryData(response.data);
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  //change language
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  return (
    <div className="container">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={1000}
        gravity={1.5}
        colors={['#ff0000', '#00ff00', '#0000ff']}
        recycle={false}
      />

      {selectedLanguage === 'en' ? (
        <div className="result-page">
          {loading && (
            <div className="loading-popup">
              <center>
                <h2 className='loader-line'>Loading...</h2>
              </center>
            </div>
          )}
          {showResult && result && (
            <div>
              <center className='header-text'>
                <h1 className='h1-result'>Result</h1>
              </center>
              <center>
                <div className='box-item'>

                  <img className='item-img' src={`/icon/${result.animal}.png`} alt={result.animal} />
                  <strong><p className='p-result'>❖ {result.animal.charAt(0).toUpperCase() + result.animal.slice(1)} ❖</p></strong>
                </div>
                <div className='container-description'>
                  <h3 className='text-description'>Description :</h3>
                </div>
                {categoryData && (
                  <div>
                    <ul>
                      {categoryData.description_en.split(', ').map((description, index) => (
                        <li key={index}>- {description}.</li>
                      ))}
                    </ul>
                  </div>
                )}
              </center>
            </div>
          )}
        </div>) : (
        <>
          {loading && (
            <div className="loading-popup">
              <center>
                <h2 className='loader-line'>Loading...</h2>
              </center>
            </div>
          )}
          {showResult && result && (
            <div>
              <center className='header-text'>
                <h1 className='h1-result'>ผลลัพธ์</h1>
              </center>
              <center>
                <div className='box-item'>

                  <img className='item-img' src={`/icon/${result.animal}.png`} alt={result.animal} />
                  <strong><p className='p-result'>❖ {result.animal.charAt(0).toUpperCase() + result.animal.slice(1)} ❖</p></strong>
                </div>
                <div className='container-description'>
                  <h3 className='text-description'>คำอธิบาย :</h3>

                </div>
                {categoryData && (
                  <div>
                    <p>คุณเปลียบเหมือน {result.animal} เพราะว่าคุณมีนิสัยที่ :</p>
                    <p>{categoryData.description_th}</p>
                  </div>
                )}
              </center>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResultPage;
