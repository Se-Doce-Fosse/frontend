import { useEffect, useState } from 'react';
import { HeaderTableAdminProduto } from '../HeaderTableAdminProduto/HeaderTableAdminProduto';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminProdutoComponent.module.scss';
import { type Product, type CategoryDTO } from '../../../../types/product';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from '../../../../services/admin-product/admin-product';
import { useUser } from '../../../../context/UserContext';
import { DeleteModal } from '../../../DeleteModal/DeleteModal';
import { ProductModal, type Option } from '../../../ProductModal/ProductModal';
import { Loading } from '../../../Loading/Loading';

function TabelAdminProdutoComponent() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowToEdit, setRowToEdit] = useState<number | null>(null);
  const { user } = useUser();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [productModalValues, setProductModalValues] = useState<
    Partial<Product>
  >({
    sku: '',
    name: '',
    price: '',
    imageSrc: '',
    description: '',
    isActive: true,
    quantity: 0,
    category: { id: undefined, name: '' },
    allergens: [],
    relatedProducts: [],
  });
  const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>(
    'create'
  );
  const [productModalSubmitting, setProductModalSubmitting] = useState(false);
  const [productModalErrors, setProductModalErrors] = useState<
    Partial<Record<keyof Product, string>>
  >({});
  const [categoriaOptions, setCategoriaOptions] = useState<Option[]>([]);
  const [categoriasMap, setCategoriasMap] = useState<
    Record<string, CategoryDTO>
  >({});

  useEffect(() => {
    fetchProducts();
    fetchCategorias();
    // eslint-disable-next-line
  }, [user?.token]);

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

  const fetchCategorias = async () => {
    try {
      const data = await getCategories();
      const options: Option[] = [];
      const map: Record<string, CategoryDTO> = {};
      if (data?.categories) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.categories.forEach((cat: any) => {
          options.push({ label: cat.name, value: cat.id });
          map[cat.id] = {
            id: cat.id,
            name: cat.name,
            description: cat.description,
          };
        });
      }
      setCategoriaOptions(options);
      setCategoriasMap(map);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleDeleteRow = (targetIndex: number) => {
    setDeleteIndex(targetIndex);
    setDeleteModalOpen(true);
  };

  const confirmDeleteRow = async () => {
    if (!user?.token || deleteIndex === null) return;
    const product = products?.[deleteIndex];
    if (!product) {
      console.warn('handleDeleteRow: índice inválido', deleteIndex);
      return;
    }
    try {
      await deleteProduct(product.sku, user.token);
      setProducts((prev) => prev.filter((_, i) => i !== deleteIndex));
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setDeleteIndex(null);
    }
  };

  const handleEditRow = (idx: number) => {
    const product = products[idx];
    setProductModalValues({
      sku: product.sku,
      name: product.name,
      price: product.price,
      imageSrc: product.imageSrc,
      description: product.description,
      isActive: product.isActive,
      quantity: product.quantity ?? 0,
      category: product.category?.id
        ? (categoriasMap[product.category.id] ?? {
            id: product.category.id,
            name: product.category.name,
          })
        : { id: undefined, name: '' },
      allergens: product.allergens,
      relatedProducts: product.relatedProducts,
    });
    setProductModalMode('edit');
    setRowToEdit(idx);
    setModalOpen(true);
    setProductModalErrors({});
  };

  const handleNewProduct = () => {
    setProductModalValues({
      sku: '',
      name: '',
      price: '',
      imageSrc: '',
      description: '',
      isActive: true,
      quantity: 0,
      category: { id: undefined, name: '' },
      allergens: [],
      relatedProducts: [],
    });
    setProductModalMode('create');
    setRowToEdit(null);
    setModalOpen(true);
    setProductModalErrors({});
  };

  const validateProduct = (values: Partial<Product>) => {
    const errors: Partial<Record<keyof Product, string>> = {};
    if (!values.name) errors.name = 'Nome obrigatório';
    if (!values.price) errors.price = 'Preço obrigatório';
    if (!values.category?.id) errors.category = 'Categoria obrigatória';
    return errors;
  };

  const handleProductModalChange = (patch: Partial<Product>) => {
    setProductModalValues((prev) => ({ ...prev, ...patch }));
  };

  const handleProductModalSubmit = async () => {
    const errors = validateProduct(productModalValues);
    setProductModalErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setProductModalSubmitting(true);
    try {
      const categoriaId = productModalValues.category?.id;
      const categoriaObj = categoriaId
        ? categoriasMap[categoriaId]
        : { id: undefined, name: '' };
      if (productModalMode === 'create') {
        await createProduct(
          {
            ...productModalValues,
            price: productModalValues.price ?? '',
            isActive: !!productModalValues.isActive,
            category: categoriaObj,
          } as Product,
          user!.token
        );
      } else if (rowToEdit !== null) {
        await updateProduct(
          productModalValues.sku!,
          {
            ...productModalValues,
            price: productModalValues.price ?? '',
            isActive: !!productModalValues.isActive,
            category: categoriaObj,
          } as Product,
          user!.token
        );
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setProductModalSubmitting(false);
    }
  };

  return (
    <div className={styles.TabelAdminProdutoComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Produtos</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Novo Produto"
            icon={BsPlus}
            onClick={handleNewProduct}
            variant="primary"
            className={styles.btn}
          />
        </div>
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <HeaderTableAdminProduto
            produtos={products}
            deleteRow={handleDeleteRow}
            editRow={handleEditRow}
          />
        )}
      </div>
      <DeleteModal
        item={
          deleteIndex !== null && products[deleteIndex]
            ? products[deleteIndex].name
            : ''
        }
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onClickConfirm={confirmDeleteRow}
      />
      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={productModalMode}
        title={
          productModalMode === 'create' ? 'Adicionar Produto' : 'Editar Produto'
        }
        isSubmitting={productModalSubmitting}
        values={productModalValues}
        errors={productModalErrors}
        onChange={handleProductModalChange}
        categoriaOptions={categoriaOptions}
        statusOptions={[
          { label: 'Ativo', value: 'true' },
          { label: 'Inativo', value: 'false' },
        ]}
        onSubmit={handleProductModalSubmit}
      />
    </div>
  );
}

export default TabelAdminProdutoComponent;
