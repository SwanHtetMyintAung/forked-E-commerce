import React, { useState, useEffect} from "react";
import Spinner from 'react-bootstrap/Spinner';

function Loader() {

    //State to track Loading
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        //Simulate content loading (e.g., API call)
        const timer = setTimeout(() => {
            setIsLoading(false); //Set Loading to false after 3 seconds
        }, 2000);

        //CLeanup the timer when the component unmounts
        return () => clearTimeout(timer);
    }, []);

  return (
    <div>
      {isLoading && (
        // Show spinner while loading
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '100vh' }}
        >
  
          <Spinner animation="border" variant="success" role="status" className="fs-5">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  );
}

export default Loader;