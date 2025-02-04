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
import Products from './pages/Products.jsx';
import PrivateRoutes from './components/PrivateRoutes.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminRoutes from './pages/Admin/AdminRoutes.jsx';
import CreateCategory from './pages/Admin/Category/CreateCategory.jsx';
import ManageCategory from './pages/Admin/Category/ManageCategory.jsx';
import CreateProduct from './pages/Admin/Product/CreateProduct.jsx';
import ManageProduct from './pages/Admin/Product/ManageProduct.jsx';

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
       <Route path="/products" element={<Products/>}/>



       {/* Admin Routes */}
       <Route path='/admin/' element={<AdminRoutes/>}>
        <Route path='dashboard' element={<AdminDashboard/>}/>
        <Route path='category/add' element={<CreateCategory/>}/>
        <Route path='categories/manage' element={<ManageCategory/>}/>
        <Route path='product/add' element={<CreateProduct/>}/>
        <Route path='products/manage' element={<ManageProduct/>}/>
       </Route>
    </Route>

   

  )
)

createRoot(document.getElementById('root')).render(
   <Provider store={store}>
    <RouterProvider router={router} />
   </Provider>
)
