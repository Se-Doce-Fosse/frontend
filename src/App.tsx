import { Routes, Route } from 'react-router-dom';
import { NavBar } from '@components';
import { Home } from '@pages';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <NavBar />
      <main style={{ marginLeft: '12rem', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route path="/estoque" element={<div>Estoque</div>} />
          <Route path="/produtos" element={<div>Produtos</div>} />
          <Route path="/pedidos" element={<div>Pedidos</div>} />
          <Route path="/comentarios" element={<div>Comentários</div>} />
          <Route path="/configuracoes" element={<div>Configurações</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
