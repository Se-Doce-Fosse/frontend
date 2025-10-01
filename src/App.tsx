import { Routes, Route, BrowserRouter } from 'react-router-dom';
import {
  Dashboard,
  Estoque,
  Produtos,
  Pedidos,
  Comentarios,
  Configuracoes,
  Home,
  Login,
} from '@pages';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/estoque" element={<Estoque />} />
            <Route path="/admin/produtos" element={<Produtos />} />
            <Route path="/admin/pedidos" element={<Pedidos />} />
            <Route path="/admin/comentarios" element={<Comentarios />} />
            <Route path="/admin/configuracoes" element={<Configuracoes />} />
            <Route path="/login/" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </main>
    </UserProvider>
  );
}

export default App;
