import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import './css/DetailPage.css'
import { type } from 'os';
import axios from 'axios';

type Mostlike = {
  id: number;
  animal: string;
  choiceEn: string;
  choiceTh: string;

};

type Leastlike = {
  id: number;
  animal: string;
  choiceTh: string;
  choiceEn: string;
};

interface CategoryData {
  id: number;
  categoryNameTh: string | null;
  categoryNameEn: string | null;
  description_th: string;
  description_en: string;
  choiceEntities: any; // Adjust the type as needed
  historyEntities: any; // Adjust the type as needed
}

function DetailPage() {
  const [MostData, setMostData] = useState<Mostlike[]>([]);
  const [LeastData, setLeastData] = useState<Leastlike[]>([]);
  const [categoryId, setCategoryId] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const historyId = searchParams.get('historyId');
  const [DesData, setDesData] = useState([]);

  const [categoryData, setCategoryData] = useState<CategoryData>({} as CategoryData);
  const CatId = searchParams.get('category_id');



  const fetchDetailData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/get/history/detail?historyId=${historyId}`);

      const responseData = await response.json();

      const leastData = responseData.filter((item: { type: boolean; }) => item.type === false);
      const mostData = responseData.filter((item: { type: boolean; }) => item.type === true);

      setLeastData(leastData);
      setMostData(mostData);
    } catch (error) {
      console.error('Error fetching detail data:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:8080/api/get/description?categoryId=${CatId}`);
        setCategoryData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [CatId]);


  //get category ID
  const fetchCatIdData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/get/history/byId?historyId=${historyId}`);
      const responseData = await response.json();

      if (Array.isArray(responseData) && responseData.length > 0) {
        // Assuming categoryId is present in the first item of the array
        const firstItem = responseData[0];
        const categoryIdFromResponse = firstItem.categoryId;

        setCategoryId(categoryIdFromResponse);
        console.log('Category ID:', categoryIdFromResponse);
      } else {
        console.error('Invalid or empty response data:', responseData);
      }
    } catch (error) {
      console.error('Error fetching Category ID data:', error);
    }
  };

  const categoryToAnimal: { [key: number]: string } = {
    1: 'cow',
    2: 'rat',
    3: 'bear',
    4: 'eagle',
  };

  useEffect(() => {
    fetchDetailData();
    fetchCatIdData();
  }, []);

 //change language
 const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');

 useEffect(() => {
   localStorage.setItem('selectedLanguage', selectedLanguage);
 }, [selectedLanguage]);

  return (
    <>
    {selectedLanguage === 'en' ? (
    <div className='container-detail'>
      <h1 className='h1-detail'>Result Detail</h1>

      <li className='text-header-detail'>
        The choices you have selected that you consider<strong> <u> most like you</u></strong>
      </li>
      {MostData.map((mostLike) => (
        <div className="item-wrapper-detail" key={mostLike.id}>
          <button className="item-detail-most">{mostLike.choiceEn}</button>
        </div>
      ))}

      <li className='text-header-detail'>
        The choices you have selected that you consider<strong> <u> least like you</u></strong>
      </li>
      {LeastData.map((leastLike) => (
        <div className="item-wrapper-detail" key={leastLike.id}>
          <button className='item-detail-least'>
            {leastLike.choiceEn}
          </button>
        </div>
      ))}

      <br /><br />
      <div>
        <li className='text-header-detail'> Result : </li> <br />
        <div className='box-item-img'>
          {categoryId !== null ? (
            <img
              className='item-img-detail'
              src={`/icon/${categoryToAnimal[categoryId]}.png`}
              alt={categoryToAnimal[categoryId]}
            />
          ) : (
            <p>Loading category ID or no data available...</p>
          )}
        </div>
      </div>
      <div>
        <li className='text-header-detail'> Description : </li> <br />
        {categoryId !== null && categoryToAnimal[categoryId] ? (
         <p className='text-result-name'>
         You have a habit similar to "{categoryToAnimal[categoryId]}"
         <div>
      <p>{categoryData.description_en}</p>
    </div>
       </p>
       
        ) : null}
      </div>
    </div>
    ) : (

      <div className='container-detail'>
      <h1 className='h1-detail'>รายละเอียดประวัติ</h1>

      <li className='text-header-detail'>
        สิ่งที่คุณเลือกที่<strong><u>เป็นตัวคุณที่สุด</u></strong>
      </li>
      {MostData.map((mostLike) => (
        <div className="item-wrapper-detail" key={mostLike.id}>
          <button className="item-detail-most">{mostLike.choiceTh}</button>
        </div>
      ))}

      <li className='text-header-detail'>
        สิ่งที่คุณเลือกที่<strong><u>ไม่ใช่ตัวคุณ</u></strong>
      </li>
      {LeastData.map((leastLike) => (
        <div className="item-wrapper-detail" key={leastLike.id}>
          <button className='item-detail-least'>
            {leastLike.choiceTh}
          </button>
        </div>
      ))}

      <br /><br />
      <div>
        <li className='text-header-detail'> ผลลัพธ์ : </li> <br />
        <div className='box-item-img'>
          {categoryId !== null ? (
            <img
              className='item-img-detail'
              src={`/icon/${categoryToAnimal[categoryId]}.png`}
              alt={categoryToAnimal[categoryId]}
            />
          ) : (
            <p>กำลังโหลดข้อมูล...</p>
          )}
        </div>
      </div>
      <div>
        <li className='text-header-detail'> คำอธิบาย : </li> <br />
        {categoryId !== null && categoryToAnimal[categoryId] ? (
         <p className='text-result-name'>
         คุณมีนิสัยคล้ายกลับ "{categoryToAnimal[categoryId]}" เพราะว่าคุณ
         <div>
      <p>{categoryData.description_th}</p>
    </div>
       </p>
       
        ) : null}
      </div>
    </div>

      )}
    </>
  );

}

export default DetailPage;
