import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import RequiredAuth from './components/RequiredAuth/RequiredAuth'
import ToastNofitication from './components/ToastNotification/ToastNofitication'
import Layout from './layouts/Layout'
import DieuKhien from './pages/DieuKhien/DieuKhien'
import DuLieuQuanTrac from './pages/DuLieuQuanTrac/DuLieuQuanTrac'
import GuidePage from './pages/HuongDan/GuidePage'
import LichSuQuanTrac from './pages/LichSuQuanTrac/LichSuQuanTrac'
import LoginPage from './pages/LoginPage/LoginPage'
import TrangChu from './pages/TrangChu/TrangChu'
import { QuanLyQuanTracEdit } from './pages/DuLieuQuanTrac/DuLieuQuanTracEdit'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequiredAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/trang-chu" replace />} />
            <Route path="trang-chu" element={<TrangChu />} />
            <Route path="dieu-khien" element={<DieuKhien />} />
            <Route path="du-lieu-quan-trac" element={<DuLieuQuanTrac />} />
            <Route path="lich-su-quan-trac" element={<LichSuQuanTrac />} />
            <Route path="huong-dan" element={<GuidePage />} />
            <Route
              path="du-lieu-quan-trac/edit"
              element={<QuanLyQuanTracEdit />}
            ></Route>
          </Route>
        </Route>
      </Routes>
      <ToastNofitication />
    </BrowserRouter>
  )
}

export default App
