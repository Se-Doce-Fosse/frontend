import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './EstoqueModal.module.scss';
import { Button, Input, Select } from '@components';

export type Option = { label: string; value: string };

export type EstoqueValues = {
  nome: string;
  quantidade: string;
  preco: string;
  categoria: string;
  unidadeMedida: string;
};

export interface EstoqueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  isSubmitting?: boolean;
  values: EstoqueValues;
  onChange: (patch: Partial<EstoqueValues>) => void;
  categoriaOptions: Option[];
  unidadeMedidaOptions: Option[];
  onSubmit?: () => void;
  mode?: 'view' | 'edit';
}

export function EstoqueModal({
  open,
  onOpenChange,
  title = 'ModalEstoque',
  isSubmitting,
  values,
  onChange,
  categoriaOptions,
  unidadeMedidaOptions,
  onSubmit,
  mode = 'edit',
}: EstoqueModalProps) {
  const isViewMode = mode === 'view';

  const handleNome: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    onChange({ nome: e.target.value });

  const handleQuantidade: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    onChange({ quantidade: e.target.value });

  const handlePreco: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    onChange({ preco: e.target.value });

  const handleCategoria: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    onChange({ categoria: e.target.value });

  const handleUnidadeMedida: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => onChange({ unidadeMedida: e.target.value });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>

          <form
            className={styles.formGrid}
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit?.();
            }}
          >
            <div className={styles.fieldNome}>
              <Input
                label="Nome"
                value={values.nome}
                onChange={handleNome}
                disabled={isViewMode}
              />
            </div>

            <div className={styles.fieldQuantidade}>
              <Input
                label="Quantidade"
                type="number"
                value={values.quantidade}
                onChange={handleQuantidade}
                disabled={isViewMode}
              />
            </div>

            <div className={styles.fieldPreco}>
              <Input
                label="Preço"
                type="number"
                value={values.preco}
                onChange={handlePreco}
                disabled={isViewMode}
              />
            </div>

            <div className={styles.fieldCategoria}>
              <label className={styles.label}>Categoria</label>
              <Select
                placeholder="Selecione a categoria"
                options={categoriaOptions}
                value={values.categoria}
                onChange={handleCategoria}
                disabled={isViewMode}
              />
            </div>

            <div className={styles.fieldUnidadeMedida}>
              <label className={styles.label}>Unidade de Medida</label>
              <Select
                placeholder="Selecione a unidade"
                options={unidadeMedidaOptions}
                value={values.unidadeMedida}
                onChange={handleUnidadeMedida}
                disabled={isViewMode}
              />
            </div>

            <div className={styles.footer}>
              <Dialog.Close asChild>
                <Button
                  label={isViewMode ? 'Fechar' : 'Cancelar'}
                  variant="outlined"
                />
              </Dialog.Close>
              {!isViewMode && (
                <Button
                  label="Salvar"
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                />
              )}
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
