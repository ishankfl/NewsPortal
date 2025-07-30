import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/admin/layouts/AdminLayout';
import AddUser from './components/admin/user/AddUser';
import ViewUsers from './components/admin/user/ViewUsers';
import Login from './components/admin/auth/Login';
// import AdminLayout from './layouts/AdminLayout';
// import Dashboard from './pages/admin/Dashboard';
// import News from './pages/news/News';
// import ManageNews from './pages/news/ManageNews';
// import AddNews from './pages/news/AddNews';
// import ManageMedia from './pages/media/ManageMedia';
// import ManageAdvertises from './pages/advertises/ManageAdvertises';
// import AddAdvertise from './pages/advertises/AddAdvertise';
// import BannerNews from './pages/banner/BannerNews';
// import Users from './pages/users/Users';
// import ManageUsers from './pages/users/ManageUsers';
// import AddUser from './pages/users/AddUser';
// import Profile from './pages/users/Profile';
// import ResetPassword from './pages/users/ResetPassword';
import { ToastContainer, toast } from 'react-toastify';
import EditUser from './components/admin/user/EditUser';
function App() {
  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/manage" element={<ViewUsers />} />
          <Route path="users/edit/:id" element={<EditUser />} />
        </Route>
      </Routes> 
      <ToastContainer position="top-right" />
    </>
  );
}


export default App;
