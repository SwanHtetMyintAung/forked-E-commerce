import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Navigation from './pages/Auth/Navigation.jsx';
import Loader from './components/Loader.jsx';
import { Outlet } from 'react-router-dom';
import React from 'react';


function App() {


  return (
    <React.Fragment>
      <ToastContainer />
      <Loader />
      <Navigation />
      <main>
        <Outlet />
      </main>
      <footer className='p-3 mt-5'>
        <p className="text-center text-light">
          Copyright © {new Date().getFullYear()} Mega Mart (Myanmar)
        </p>
         <div className='text-center'>
         <img src="/images/mega_mart_logo.png" alt=""  width={70}/>
         </div>
      </footer>
    </React.Fragment>
  )
}

export default App
