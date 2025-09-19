import styles from './AdicionarProduto.module.scss';
import { Input, ModalDropdown, AddToCartButton } from '@components';

export const AdicionarProduto = () => {
  const categories = ['Bebidas', 'Doces', 'Salgados', 'Padaria', 'Outros'];
  const statuses = ['Disponível', 'Esgotado', 'Em Breve'];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formGrid}>
        <h1 className={styles.pageTitle}>Adicionar Produto</h1>

        <div className={styles.imagePlaceholder}>{/* Imagem */}</div>

        <Input label="Nome" placeholder="Nome do produto" />
        <Input label="Preço" placeholder="R$ 0,00" type="number" />

        <ModalDropdown label="Categoria" options={categories} />
        <ModalDropdown label="Status" options={statuses} />

        <div className={styles.inputGroupRow}>
          <Input label="Peso Líquido" placeholder="Ex: 500g" />
          <Input label="Validade" placeholder="DD/MM/AAAA" />
          <Input label="Armazenamento" placeholder="Ex: Geladeira" />
        </div>

        <div className={styles.descriptionContainer}>
          <label htmlFor="description" className={styles.descriptionLabel}>
            Descrição
          </label>
          <textarea
            id="description"
            className={styles.descriptionField}
            placeholder="Descreva o produto..."
            rows={5}
          ></textarea>
        </div>

        <div className={styles.extraContainer}>
          <p></p>
          <AddToCartButton></AddToCartButton>
        </div>
      </div>
    </div>
  );
};

export default AdicionarProduto;
