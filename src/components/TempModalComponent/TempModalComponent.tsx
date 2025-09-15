import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import styles from './TempModalComponent.module.scss';
import type { ProdutoRow } from '../TempTablesComp/HeaderTableAdmin/HeaderTableAdmin';

type ModalProps = {
  closeModal: () => void;
  onSubmit: (data: ProdutoRow) => void;
  defaultValue?: ProdutoRow;
};

export const TempModalComponent: React.FC<ModalProps> = ({
  closeModal,
  onSubmit,
  defaultValue,
}) => {
  const [formState, setFormState] = useState<ProdutoRow>(
    defaultValue || {
      produto: '',
      categoria: '',
      preco: 0,
      status: 'ativo',
      estoque: 0,
    }
  );
  const [errors, setErrors] = useState<string>('');

  const validateForm = () => {
    const { produto, categoria, preco, status, estoque } = formState;
    const errorFields: string[] = [];
    if (!produto) errorFields.push('produto');
    if (!categoria) errorFields.push('categoria');
    if (preco === null || preco === undefined || preco < 0)
      errorFields.push('preco');
    if (!status) errorFields.push('status');
    if (estoque === null || estoque === undefined || estoque < 0)
      errorFields.push('estoque');
    setErrors(errorFields.join(', '));
    return errorFields.length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === 'preco' || name === 'estoque' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formState);
    closeModal();
  };

  return (
    <div
      className={styles['modal-container']}
      onClick={(e) => {
        if ((e.target as HTMLElement).className === styles['modal-container'])
          closeModal();
      }}
    >
      <div className={styles.modal}>
        <form>
          <div className={styles['form-group']}>
            <label htmlFor="produto">Produto</label>
            <input
              name="produto"
              onChange={handleChange}
              value={formState.produto}
              placeholder="Nome do produto"
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="categoria">Categoria</label>
            <input
              name="categoria"
              onChange={handleChange}
              value={formState.categoria}
              placeholder="Categoria"
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="preco">Preço</label>
            <input
              name="preco"
              type="number"
              min={0}
              step="0.01"
              onChange={handleChange}
              value={formState.preco}
              placeholder="Preço em R$"
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="status">Status</label>
            <select
              name="status"
              onChange={handleChange}
              value={formState.status}
              required
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="estoque">Quantidade em estoque</label>
            <input
              name="estoque"
              type="number"
              min={0}
              step="1"
              onChange={handleChange}
              value={formState.estoque}
              placeholder="Estoque"
              required
            />
          </div>
          {errors && (
            <div className={styles.error}>{`Preencha: ${errors}`}</div>
          )}
          <button type="submit" className={styles.btn} onClick={handleSubmit}>
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};
