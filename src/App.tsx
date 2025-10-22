import { Routes, Route, BrowserRouter } from 'react-router-dom';
import {
  Dashboard,
  Estoque,
  Produtos,
  ProductDetail,
  Pedidos,
  Comentarios,
  Configuracoes,
  Home,
  Login,
  SobreNos,
} from '@pages';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { ClienteProvider } from './context/ClienteContext';
import { ProdutosAdmin } from './pages/Admin/Produtos';
import ClienteLogin from './pages/Cliente/Login/Log';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <ClienteProvider>
          <main>
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/estoque" element={<Estoque />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/produtos/:produtoId" element={<ProductDetail />} />
              <Route path="/admin/produtos" element={<ProdutosAdmin />} />
              <Route path="/admin/pedidos" element={<Pedidos />} />
              <Route path="/admin/comentarios" element={<Comentarios />} />
              <Route path="/admin/configuracoes" element={<Configuracoes />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/login" element={<ClienteLogin />} />
              <Route path="/sobre-nos" element={<SobreNos />} />
            </Routes>
            </BrowserRouter>
          </main>
        </ClienteProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
