import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import styles from './TempModalComponent.module.scss';
import type { ProdutoRow } from '../HeaderTableAdmin/HeaderTableAdmin';

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
      quantidade: 0,
    }
  );
  const [errors, setErrors] = useState<string>('');

  const validateForm = () => {
    const { produto, categoria, preco, status, quantidade } = formState;
    const errorFields: string[] = [];
    if (!produto) errorFields.push('produto');
    if (!categoria) errorFields.push('categoria');
    if (preco === null || preco === undefined || preco < 0)
      errorFields.push('preco');
    if (!status) errorFields.push('status');
    if (quantidade === null || quantidade === undefined || quantidade < 0)
      errorFields.push('quantidade');
    setErrors(errorFields.join(', '));
    return errorFields.length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === 'preco' || name === 'quantidade' ? Number(value) : value,
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
            <label htmlFor="quantidade">Quantidade em estoque</label>
            <input
              name="quantidade"
              type="number"
              min={0}
              step="1"
              onChange={handleChange}
              value={formState.quantidade}
              placeholder="Quantidade"
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
