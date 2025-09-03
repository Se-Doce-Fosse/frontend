import { Routes, Route } from 'react-router-dom';
import { NavBar } from '@components';
import {
  Dashboard,
  Estoque,
  Produtos,
  Pedidos,
  Comentarios,
  Configuracoes,
} from '@pages';

function App() {
  return (
    <div>
      <NavBar />
      <main>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/comentarios" element={<Comentarios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
