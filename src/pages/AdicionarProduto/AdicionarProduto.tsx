import styles from './AdicionarProduto.module.scss';
import { Input, ModalDropdown } from '@components';
import { Button } from '../../components/Button/Button';
import { BsPlus } from 'react-icons/bs';
import { useState } from 'react';
import { TagInput } from '../../components/TagIngrediente/TagInput';

export const AdicionarProduto = () => {
  //Precisa colocar as categorias da Se Doce Fosse aqui
  const categories = ['Bebidas', 'Doces', 'Salgados', 'Padaria', 'Outros'];
  const statuses = ['Disponível', 'Esgotado', 'Em Breve'];

  const [ingredientes, setIngredientes] = useState<string[]>([]);

  //const [nutritionFacts, setNutritionFacts] = useState<{ nutrient: string; value: string; unit: string }[]>([]);

  const addIngrediente = () => {
    setIngredientes([...ingredientes, '']);
  };

  const updateIngrediente = (index: number, value: string) => {
    const updated = [...ingredientes];
    updated[index] = value;
    setIngredientes(updated);
  };

  const removeIngrediente = (index: number) => {
    setIngredientes(ingredientes.filter((_, i) => i !== index));
  };
  /*
  const addNutritionFact = () => {
    setNutritionFacts([...nutritionFacts, { nutrient: "", value: "", unit: "" }]);
  };

  
  const handleSubmit = () => {
    console.log({
      ingredientes,
      nutritionFacts,
      
    });
  };*/

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

        <h2 className={styles.ingredientsLabel}>Ingredientes</h2>
        <div className={styles.ingredientsContainer}>
          <div className={styles.chips}>
            {ingredientes.map((ing, i) => (
              <TagInput
                key={i}
                value={ing}
                onChange={(val) => updateIngrediente(i, val)}
                onRemove={() => removeIngrediente(i)}
                placeholder="Ingrediente"
              />
            ))}
          </div>

          <div className={styles.buttonWrapper}>
            <Button
              label="Adicionar item"
              icon={BsPlus}
              onClick={addIngrediente}
              variant="primary"
            />
          </div>
        </div>

        <h2 className={styles.nutritionFactsLabel}>Informações Nutricionais</h2>
        <div className={styles.nutritionFactsContainer}></div>
      </div>
    </div>
  );
};
export default AdicionarProduto;
