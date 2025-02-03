import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import store from './redux/store.js';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

//Public Routes import
//auth
import Register from './pages/Auth/Register.jsx';
import Login from './pages/Auth/Login.jsx';
//
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx'
//product
import Products from './pages/Product/Products.jsx';
import FilteredProduct from './pages/Product/FilteredProduct.jsx';
import ProductLayout from './pages/Product/ProductLayout.jsx';

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
      
      <Route path="/products" element={<ProductLayout/>}>
        <Route index  element={<Products/>}/>
        <Route path="filter" element={<FilteredProduct/>}/>
      </Route>
      <Route path="*" element={<NotFound/>}/>
    </Route>

  )
)

createRoot(document.getElementById('root')).render(
   <Provider store={store}>
    <RouterProvider router={router} />
   </Provider>
)
