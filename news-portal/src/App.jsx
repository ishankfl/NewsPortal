import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/admin/layouts/AdminLayout';
import Dashboard from './components/admin/dashboard/Dashboard';
import AddUser from './components/admin/user/AddUser';
import ViewUsers from './components/admin/user/ViewUsers';
import Login from './components/admin/auth/Login';
import { ToastContainer, toast } from 'react-toastify';
import EditUser from './components/admin/user/EditUser';
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
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}


export default App;

