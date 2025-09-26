import { Routes, Route, BrowserRouter } from 'react-router-dom';
import {
  Dashboard,
  Estoque,
  Pedidos,
  Comentarios,
  Configuracoes,
  Home,
  Login,
  ProdutosAdmin,
  Produtos,
} from '@pages';

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/admin/produtos" element={<ProdutosAdmin />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/comentarios" element={<Comentarios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/login/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
