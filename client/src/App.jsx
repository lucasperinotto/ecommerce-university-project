import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';

import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Routes>
              {/* Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/producto/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />
              <Route path="/restablecer-contrasena/:token" element={<ResetPasswordPage />} />

              {/* Públicas con auth opcional */}
              <Route path="/carrito" element={<CartPage />} />

              {/* Privadas (usuarios autenticados) */}
              <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
              <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="/mis-ordenes" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
              <Route path="/mis-ordenes/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />

              {/* Admin */}
              <Route path="/admin/productos" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
              <Route path="/admin/usuarios" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
              <Route path="/admin/ordenes" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
            </Routes>
            <Footer />
          </div>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
