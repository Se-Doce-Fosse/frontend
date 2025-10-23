import { useEffect, useState } from 'react';
import { HeaderTableAdminProduto } from '../HeaderTableAdminProduto/HeaderTableAdminProduto';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminProdutoComponent.module.scss';
import { type Product } from '../../../..//types/product';
import {
  getAllProducts,
  deleteProduct,
} from '../../../../services/admin-product/admin-product';
import { useUser } from '../../../../context/UserContext';

function TabelAdminProdutoComponent() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowToEdit, setRowToEdit] = useState<number | null>(null);
  const { user } = useUser();

  const fetchProducts = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const data = await getAllProducts(user.token);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log(modalOpen);
  console.log(loading);

  const handleDeleteRow = async (targetIndex: number) => {
    if (!user?.token) return;
    const product = products?.[targetIndex];
    if (!product) {
      console.warn('handleDeleteRow: índice inválido', targetIndex);
      return;
    }
    try {
      await deleteProduct(product.sku, user.token);
      setProducts((prev) => prev.filter((_, i) => i !== targetIndex));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditRow = (idx: number) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };

  const handleSubmit = (newRow: Product) => {
    if (rowToEdit === null) {
      setProducts([...products, newRow]);
    } else {
      setProducts(
        products.map((currRow, idx) => {
          if (idx !== rowToEdit) return currRow;
          return newRow;
        })
      );
    }
  };

  console.log(handleSubmit);

  useEffect(() => {
    fetchProducts();
  }, [user?.token]);

  return (
    <div className={styles.TabelAdminProdutoComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Produtos</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Novo Produto"
            icon={BsPlus}
            onClick={() => setModalOpen(true)}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>
      <div>
        <HeaderTableAdminProduto
          produtos={products}
          deleteRow={handleDeleteRow}
          editRow={handleEditRow}
        />
      </div>
    </div>
  );
}

export default TabelAdminProdutoComponent;
