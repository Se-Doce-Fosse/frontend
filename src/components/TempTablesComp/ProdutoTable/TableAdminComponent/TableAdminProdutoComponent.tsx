import { useEffect, useState, useMemo, useCallback } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { normalizeDecimalString } from '../../../../utils/price';
import { useUser } from '../../../../context/UserContext';
import { DeleteModal } from '../../../DeleteModal/DeleteModal';
import { ProductModal, type Option } from '../../../ProductModal/ProductModal';
import { Loading } from '../../../Loading/Loading';
import AlertModal from '../../../AlertModal/AlertModal';

interface TableAdminProductComponentProps {
  filterStatus: string;
  searchTerm: string;
}

function TabelAdminProdutoComponent({
  filterStatus,
  searchTerm,
}: TableAdminProductComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
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
    supplies: [],
  });
  const [productModalMode, setProductModalMode] = useState<
    'create' | 'edit' | 'view'
  >('create');
  const [productModalSubmitting, setProductModalSubmitting] = useState(false);
  const [productModalErrors, setProductModalErrors] = useState<
    Partial<Record<keyof Product, string>>
  >({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertVariant, setAlertVariant] = useState<
    'success' | 'error' | 'info'
  >('info');
  const [alertMessages, setAlertMessages] = useState<string[] | undefined>(
    undefined
  );
  const [alertError, setAlertError] = useState<unknown>(undefined);
  const [categoriaOptions, setCategoriaOptions] = useState<Option[]>([]);
  const [categoriasMap, setCategoriasMap] = useState<
    Record<string, CategoryDTO>
  >({});

  const fetchProducts = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const datas = await getAllProducts(user.token);
      setProducts(datas);
      console.log(datas);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const fetchCategorias = useCallback(async () => {
    try {
      const data = await getCategories();
      const options: Option[] = [];
      const map: Record<string, CategoryDTO> = {};
      if (data?.categories) {
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
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategorias();
  }, [fetchProducts, fetchCategorias]);

  const handleDeleteRow = (targetIndex: number) => {
    setDeleteIndex(targetIndex);
    setDeleteModalOpen(true);
  };

  const confirmDeleteRow = async () => {
    if (!user?.token || deleteIndex === null) return;
    const product = products?.[deleteIndex];
    if (!product) return;
    try {
      await deleteProduct(product.sku, user.token);
      await fetchProducts();
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
      supplies: product.supplies ?? [],
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
      supplies: [],
    });
    setProductModalMode('create');
    setRowToEdit(null);
    setModalOpen(true);
    setProductModalErrors({});
  };

  const handleViewRow = (idx: number) => {
    const product = products[idx];
    setProductModalValues({
      sku: product.sku,
      name: product.name,
      price: product.price,
      imageSrc: product.imageSrc,
      description: product.description,
      isActive: product.isActive,
      quantity: product.quantity ?? 0,
      category: product.category,
      allergens: product.allergens,
      relatedProducts: product.relatedProducts,
      supplies: product.supplies ?? [],
    });
    setProductModalMode('view');
    setModalOpen(true);
  };

  const validateProduct = (values: Partial<Product>) => {
    const errors: Partial<Record<keyof Product, string>> = {};
    if (!values.name) errors.name = 'Nome obrigatório';
    if (!values.price) errors.price = 'Preço obrigatório';
    if (!values.category?.id) errors.category = 'Categoria obrigatória';
    return errors;
  };

  const handleProductModalChange = useCallback((patch: Partial<Product>) => {
    setProductModalValues((prev) => ({ ...prev, ...patch }));
  }, []);

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

      const normalizedPrice = normalizeDecimalString(
        productModalValues.price ?? ''
      );

      const productSupply = (productModalValues.supplies ?? []).map(
        (s: any) => ({
          supplyId: typeof s === 'number' ? s : s.id,
          quantity: s.quantity ?? 0,
          productSupplyEnum:
            productModalMode === 'create' ? 'CREATE_ENUM' : 'UPDATE_ENUM',
        })
      );

      const payload = {
        ...productModalValues,
        price: normalizedPrice,
        isActive: !!productModalValues.isActive,
        category: categoriaObj,
        productSupply,
      };

      if (productModalMode === 'create') {
        await createProduct(payload as any, user!.token);
        setAlertVariant('success');
        setAlertMessages(['Produto criado com sucesso.']);
        setAlertError(undefined);
        setAlertOpen(true);
      } else if (rowToEdit !== null) {
        await updateProduct(
          productModalValues.sku!,
          payload as any,
          user!.token
        );
        setAlertVariant('success');
        setAlertMessages(['Produto atualizado com sucesso.']);
        setAlertError(undefined);
        setAlertOpen(true);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setAlertVariant('error');
      setAlertMessages(undefined);
      setAlertError(error);
      setAlertOpen(true);
    } finally {
      setProductModalSubmitting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((products) => {
      const matchesSearch = products.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus
        ? products.category.name === filterStatus
        : true;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, filterStatus]);

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
            produtos={filteredProducts}
            deleteRow={handleDeleteRow}
            editRow={handleEditRow}
            viewRow={handleViewRow}
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
          productModalMode === 'create'
            ? 'Adicionar Produto'
            : productModalMode === 'edit'
              ? 'Editar Produto'
              : 'Detalhes do Produto'
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
        disabled={productModalMode === 'view'}
      />
      <AlertModal
        open={alertOpen}
        onOpenChange={setAlertOpen}
        variant={alertVariant}
        messages={alertMessages}
        error={alertError}
      />
    </div>
  );
}

export default TabelAdminProdutoComponent;
