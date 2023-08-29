import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/HistoryPage.css";
import Swal from "sweetalert2";

interface DataItem {
  categoryId: number;
  createDate: string;
  historyId: string;

}
const itemsPerPage = 10;
const HistoryPage = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = data.slice(startIndex, endIndex);

  useEffect(() => {
    fetchData();
  }, []);

  //next and back data history
  const handleNextPageClick = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const fetchData = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      if (email) {
        const response = await fetch(
          `http://localhost:8080/api/get/history?email=${email}`
        );
        const responseData = await response.json();

        // Assuming responseData is an array of objects with a "createDate" property
        const sortedData = responseData.sort(
          (
            a: { createDate: string | number | Date },
            b: { createDate: string | number | Date }
          ) => {
            const timeA = new Date(a.createDate).getTime();
            const timeB = new Date(b.createDate).getTime();
            return timeA - timeB; // Sorting in ascending order
          }
        );

        setData(sortedData);
        console.log(sortedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate);
    filterData(newStartDate, endDate);
  };

  const filterData = async (start: string, end: string) => {
    try {
      if (start === "" && end === "") {
        fetchData();
        return;
      }

      const email = localStorage.getItem("userEmail"); // Retrieve email from local storage

      if (email) {
        const response = await fetch(
          `http://localhost:8080/api/get/history?email=${email}&cacheBust=${Date.now()}`
        );
        const responseData = await response.json();

        // Filter the data based on the specified date range
        const filteredData = responseData.filter(
          (item: { createDate: string | number | Date }) => {
            const itemDate = new Date(item.createDate);
            const startDateObj = new Date(start);
            const endDateObj = new Date(end);

            // Set time to the beginning and end of the day
            startDateObj.setHours(0, 0, 0, 0);
            endDateObj.setHours(23, 59, 59, 999);

            return itemDate >= startDateObj && itemDate <= endDateObj;
          }
        );

        setData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return `${formattedDate}`;
  };

  const categoryToAnimal: { [key: number]: string } = {
    1: "cow",
    2: "rat",
    3: "bear",
    4: "eagle",
  };

  const handleDeleteItem = async (historyId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/delete/history?historyId=${historyId}`,
            {
              method: "DELETE",
            }
          );
  
          if (response.ok) {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            
            // Remove the deleted item from the data array
            const updatedData = data.filter(item => item.historyId !== historyId);
            setData(updatedData);
          } else {
            console.error("Error deleting item:", response.statusText);
          }
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      }
    });
  };
  

  //change language
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "en"
  );

  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  return (
    <div>
      {selectedLanguage === "en" ? (
     <div className="con-his">
     <div className="filter-box-history">
       <label className="text-my-history">My history : </label>
       <label className="text-face-filter">Filter by Date : </label>
       <input
         className="filter-input"
         type="date"
         value={startDate}
         onChange={handleStartDateChange}
       />
     </div>
     <div className="container-history">
       <ul className="list-history">
         {itemsToShow.length === 0 ? (
           <li className="no-result-history">
             <img src="/icon/no-result.png" alt="No result icon" />
             <br />
             No result
           </li>
         ) : (
           itemsToShow.map((item) => (
             <li key={item.historyId} className="item-history">
               <Link
                 to={`/history/detail?historyId=${item.historyId}&category_id=${item.categoryId}`}
                 style={{ textDecoration: "none" }}
                 key={item.historyId}
                 className="item-history"
               >
                 {categoryToAnimal[item.categoryId]}
               </Link>
               <span className="date-history">
                 {formatDate(item.createDate)}
               </span>
               <center>
                 <img
                   className="delete-icon"
                   src="/icon/icon-delete.png"
                   alt="Delete icon"
                   onClick={() => handleDeleteItem(item.historyId)}
                 />
               </center>
             </li>
           ))
         )}
       </ul>
     </div>
   
     {itemsToShow.length > 0 && (
       <div>
         <div className="page-number">
           Page {currentPage} of {totalPages}
         </div>
   
         <div className="center-button-container">
           <button
             className="btn-back-history"
             onClick={handlePreviousPageClick}
           >
             Previous Page
           </button>
           <button
             className="btn-next-history"
             onClick={handleNextPageClick}
             disabled={currentPage === totalPages}
           >
             Next Page
           </button>
         </div>
       </div>
     )}
   </div>   
      ) : (
        <>
          <div className="filter-box-history">
            <label className="text-my-history">ประวัติของ ฉัน : </label>
            <label className="text-face-filter">กรองด้วยวันที่ : </label>
            <input
              className="filter-input"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="container-history">
            {isLoading ? ( // Display loading message while loading
              <p>Loading...</p>
            ) : itemsToShow.length === 0 ? (
              <li className="no-result-history">
                <img src="/icon/no-result.png" alt="No result icon" />
                <br />
                No result
              </li>
            ) : (
              <ul className="list-history">
                {itemsToShow.map((item) => (
                  <li key={item.historyId} className="item-history">
                    <Link
                      to={`/history/detail?historyId=${item.historyId}&category_id=${item.categoryId}`}
                      style={{ textDecoration: "none" }}
                      key={item.historyId}
                      className="item-history"
                    >
                      {categoryToAnimal[item.categoryId]}
                    </Link>
                    <span className="date-history">
                      {formatDate(item.createDate)}
                    </span>
                    <center>
                      <img
                        className="delete-icon"
                        src="/icon/icon-delete.png"
                        alt="Delete icon"
                        onClick={() => handleDeleteItem(item.historyId)}
                      />
                    </center>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="page-number">
            หน้า {currentPage} / {totalPages}
          </div>

          <div className="center-button-container">
            <button
              className="btn-back-history"
              onClick={handlePreviousPageClick}
            >
              ย้อนกลับ
            </button>
            <button className="btn-next-history" onClick={handleNextPageClick}>
              หน้าต่อไป
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryPage;
