import { HelloWorld, AddToCartButton } from '@components';
import { AdicionarProduto } from '@pages';

function App() {
  return (
    <div>
      <HelloWorld name="Se Doce Fosse" />
      <AddToCartButton />
      <AdicionarProduto></AdicionarProduto>
    </div>
  );
}

export default App;
