import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import store from './redux/store.js';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

//Public Routes import
import Register from './pages/Auth/Register.jsx';
import Login from './pages/Auth/Login.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';


//This is routes for frontend ui 
const router = createBrowserRouter(
  createRoutesFromElements(
    //Home route or parent route
    <Route path='/' element={<App/>}>
      {/* Public Routes */}
       <Route path='/register' element={<Register/>}/>
       <Route path='/login' element={<Login/>}/>
       <Route index={true} path='/' element={<Home/>}/>
       <Route path='/about' element={<About/>}/>
    </Route>

  )
)

createRoot(document.getElementById('root')).render(
   <Provider store={store}>
    <RouterProvider router={router} />
   </Provider>
)
