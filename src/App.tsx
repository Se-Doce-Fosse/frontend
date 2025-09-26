import { Routes, Route, BrowserRouter } from 'react-router-dom';
import {
  Dashboard,
  Estoque,
  Produtos,
  Pedidos,
  Comentarios,
  Configuracoes,
  // Home, // Temporariamente desabilitado para visualização
  Login,
} from '@pages';
import { AdressCard } from './components/AdressCard';
import './App.css';

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          {/* Rota principal exibindo o AdressCard para visualização */}
          <Route
            path="/"
            element={
              <div className="component-viewer">
                <AdressCard
                  onSubmit={(data) => console.log('Dados do Endereço:', data)}
                />
              </div>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/produtos" element={<Produtos />} />
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
