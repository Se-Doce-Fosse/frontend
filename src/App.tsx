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
  Encomendas,
  Cupons,
} from '@pages';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { ProdutosAdmin } from './pages/Admin/Produtos';
import CartDrawerOrder from './components/Cart/CartDrawerOrder/CartDrawerOrder';
import CartDrawerFinish from './components/Cart/CartDrawerFinish/CartDrawerFinish';
import { useCart } from './context/CartContext';
import ClienteLogin from './pages/Cliente/Login/Log';
import { ClienteProvider } from './context/ClienteContext';

const AppWithDrawers: React.FC = () => {
  const {
    items,
    activeDrawer,
    setActiveDrawer,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCart();

  return (
    <>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/estoque" element={<Estoque />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produtos/:produtoId" element={<ProductDetail />} />
            <Route path="/admin/cupons" element={<Cupons />} />
            <Route path="/admin/produtos" element={<ProdutosAdmin />} />
            <Route path="/admin/pedidos" element={<Pedidos />} />
            <Route path="/admin/comentarios" element={<Comentarios />} />
            <Route path="/admin/configuracoes" element={<Configuracoes />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/login/" element={<ClienteLogin />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/encomendas" element={<Encomendas />} />
          </Routes>
        </BrowserRouter>
      </main>

      <CartDrawerOrder
        open={activeDrawer === 'order'}
        onClose={() => setActiveDrawer(null)}
        onContinue={() => setActiveDrawer('finish')}
        items={items}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
      />
      <CartDrawerFinish
        open={activeDrawer === 'finish'}
        onClose={() => setActiveDrawer(null)}
      />
    </>
  );
};

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <ClienteProvider>
          <AppWithDrawers />
        </ClienteProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
