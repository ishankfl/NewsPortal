import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/admin/layouts/AdminLayout';
import Dashboard from './components/admin/dashboard/Dashboard';
import AddUser from './components/admin/user/AddUser';
import ViewUsers from './components/admin/user/ViewUsers';
import AddNews from './components/admin/news/AddNews';
import Login from './components/admin/auth/Login';
import { ToastContainer, toast } from 'react-toastify';
import EditUser from './components/admin/user/EditUser';
import AddCategory from './components/admin/category/AddCategory';
import ViewCategories from './components/admin/category/ViewCategories';
import EditCategory from './components/admin/category/EditCategory';
import EditNews from './components/admin/news/EditNews';
import ViewNews from './components/admin/news/ViewNews';
import BannerNews from './components/admin/banner/BannerNews';

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/manage" element={<ViewUsers />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/manage" element={<ViewCategories />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />
          <Route path="news/add" element={<AddNews />} />
          <Route path="news/manage" element={<ViewNews />} />
          <Route path="news/edit/:id" element={<EditNews />} />
        </Route>
          <Route path="/" element={<BannerNews />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;







