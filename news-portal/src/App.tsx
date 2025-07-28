import { Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
// import Dashboard from './pages/Dashboard'
// import News from './pages/news/News'
// import ManageNews from './pages/news/ManageNews'
// import AddNews from './pages/news/AddNews'
// import ManageMedia from './pages/media/ManageMedia'
// import ManageAdvertises from './pages/advertises/ManageAdvertises'
// import AddAdvertise from './pages/advertises/AddAdvertise'
// import BannerNews from './pages/banner/BannerNews'
// import Users from './pages/users/Users'
// import ManageUsers from './pages/users/ManageUsers'
// import AddUser from './pages/users/AddUser'
// import Profile from './pages/users/Profile'
// import ResetPassword from './pages/users/ResetPassword'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* <Route index element={<Dashboard />} />
        <Route path="news" element={<News />} />
        <Route path="news/manage" element={<ManageNews />} />
        <Route path="news/add" element={<AddNews />} />
        <Route path="media/manage" element={<ManageMedia />} />
        <Route path="advertises/manage" element={<ManageAdvertises />} />
        <Route path="advertises/add" element={<AddAdvertise />} />
        <Route path="banner" element={<BannerNews />} />
        <Route path="users" element={<Users />} />
        <Route path="users/manage" element={<ManageUsers />} />
        <Route path="users/add" element={<AddUser />} />
        <Route path="profile" element={<Profile />} />
        <Route path="reset-password" element={<ResetPassword />} /> */}
      </Route>
    </Routes>
  )
}

export default App