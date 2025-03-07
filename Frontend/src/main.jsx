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
//user
import Profile from './pages/User/Profile.jsx';
import UserRoutes from './pages/User/UserRoutes.jsx';
import Cart from './pages/User/Cart.jsx';

import Products from './pages/Products.jsx';
import PrivateRoutes from './components/PrivateRoutes.jsx';
import AdminRoutes from './pages/Admin/AdminRoutes.jsx';
import CreateProduct from './pages/Admin/Product/CreateProduct.jsx';
import Contact from './pages/Contact.jsx';
//admin privillage
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import ManageCategory from './pages/Admin/Category/ManageCategory.jsx';
import CreateCategory from './pages/Admin/Category/CreateCategory.jsx';
import ManageProduct from './pages/Admin/Product/ManageProduct.jsx';
import ManageUser from './pages/Admin/User/ManageUser.jsx';
//This is routes for frontend ui 
const router = createBrowserRouter(
  createRoutesFromElements(
    //Home route or parent route
    <Route path='/' element={<App />}>
      {/* Public Routes */}

      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route index={true} path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path='/contact' element={<Contact/>}/>


      {/* Admin Routes */}
      <Route path='/admin/' element={<AdminRoutes />}>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='category/add' element={<CreateCategory />} />
        <Route path='categories/manage' element={<ManageCategory />} />
        <Route path='product/add' element={<CreateProduct />} />
        <Route path='products/manage' element={<ManageProduct />} />
        <Route path='users/manage' element={<ManageUser/>}/>
      </Route>

      {/* User Routes */}
      <Route path='/user/' element={<UserRoutes/>}>
         <Route path='cart' element={<Cart/>} />
         <Route path="profile" element={<Profile/>}/>
      </Route>
    </Route>



  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
