import { useState, useMemo, useEffect } from 'react';
import { HeaderTableAdminCupom } from '../HeaderTableAdminCupom/HeaderTableAdminCupom';
import type { CupomRow } from '../HeaderTableAdminCupom/HeaderTableAdminCupom';
import { BsPlus } from 'react-icons/bs';
import { Button } from '../../../Button/Button';
import styles from './TableAdminCupomComponent.module.scss';
import { useUser } from '../../../../context/UserContext';
import {
  createAdminCoupon,
  deleteAdminCoupon,
  getAdminCoupons,
  updateAdminCoupon,
  type CreateCouponPayload,
} from '../../../../services/admin-coupon/admin-coupon';
import type { Coupon } from '../../../../types/coupon';
import { Loading } from '../../../Loading/Loading';
import { AddCouponModal, type CouponFormValues } from '../../../AddCouponModal';
import { DeleteModal } from '../../../DeleteModal/DeleteModal';

interface TableAdminCupomComponentProps {
  filterStatus: string;
  searchTerm: string;
}

function TableAdminCupomComponent({
  filterStatus,
  searchTerm,
}: TableAdminCupomComponentProps) {
  const [cupons, setCupoms] = useState<CupomRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [couponBeingEdited, setCouponBeingEdited] = useState<CupomRow | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<CupomRow | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState(false);

  const mapCouponDTOToRow = (coupon: Coupon): CupomRow => {
    const validityDate = coupon.validade
      ? new Date(coupon.validade)
      : new Date();
    const isExpired = coupon.validade
      ? validityDate.getTime() < Date.now()
      : false;
    const status = coupon.ativo && !isExpired ? 'ativo' : 'inativo';

    const valorDescNumber = Number(coupon.valorDesc) || 0;
    const id = typeof coupon.id === 'number' ? coupon.id : Date.now();

    return {
      id,
      cupom: coupon.codigo,
      desconto: `${valorDescNumber}%`,
      validade: validityDate,
      validadeISO: coupon.validade ?? validityDate.toISOString().slice(0, 10),
      status,
      unico: coupon.unico ? 'Sim' : 'Não',
      valorDesc: valorDescNumber,
      ativo: Boolean(coupon.ativo),
      unicoBool: Boolean(coupon.unico),
    };
  };

  const fetchCoupons = async () => {
    if (!user?.token) {
      setError('Você precisa estar autenticado para visualizar os cupons.');
      setCupoms([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminCoupons(user.token);
      setCupoms(data.map(mapCouponDTOToRow));
    } catch (err) {
      console.error('Erro ao carregar cupons:', err);
      setError('Não foi possível carregar os cupons. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const handleAddCoupon = async (formData: CouponFormValues) => {
    if (!user?.token) {
      setError('Faça login para criar cupons.');
      return;
    }
    setFormSubmitting(true);
    setError(null);
    const payload: CreateCouponPayload = {
      codigo: formData.name.trim().toUpperCase(),
      valorDesc: formData.discount,
      validade: formData.validity,
      ativo: formData.status === 'ativo',
      unico: formData.unique,
    };
    try {
      await createAdminCoupon(payload, user.token);
      await fetchCoupons();
    } catch (err) {
      console.error('Erro ao criar cupom:', err);
      setError('Não foi possível criar o cupom. Tente novamente.');
      throw err;
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateCoupon = async (formData: CouponFormValues) => {
    if (!user?.token || !couponBeingEdited) {
      setError('Selecione um cupom para editar.');
      return;
    }
    setFormSubmitting(true);
    setError(null);
    const payload: CreateCouponPayload = {
      codigo: formData.name.trim().toUpperCase(),
      valorDesc: formData.discount,
      validade: formData.validity,
      ativo: formData.status === 'ativo',
      unico: formData.unique,
    };
    try {
      await updateAdminCoupon(couponBeingEdited.id, payload, user.token);
      await fetchCoupons();
    } catch (err) {
      console.error('Erro ao atualizar cupom:', err);
      setError('Não foi possível atualizar o cupom. Tente novamente.');
      throw err;
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteCoupon = async () => {
    if (!user?.token || !couponToDelete) {
      setError('Selecione um cupom para excluir.');
      return;
    }
    setDeletingCoupon(true);
    setError(null);
    try {
      await deleteAdminCoupon(couponToDelete.id, user.token);
      await fetchCoupons();
    } catch (err) {
      console.error('Erro ao excluir cupom:', err);
      setError('Não foi possível excluir o cupom. Tente novamente.');
    } finally {
      setDeletingCoupon(false);
      setDeleteModalOpen(false);
      setCouponToDelete(null);
    }
  };

  const handleEditRow = (idx: number) => {
    const selected = cupons[idx];
    if (!selected) return;
    setCouponBeingEdited(selected);
    setEditModalOpen(true);
  };

  const handleDeleteRow = (idx: number) => {
    const selected = cupons[idx];
    if (!selected) return;
    setCouponToDelete(selected);
    setDeleteModalOpen(true);
  };

  const filteredCupons = useMemo(() => {
    return cupons.filter((cupom) => {
      const matchesSearch = cupom.cupom
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus ? cupom.status === filterStatus : true;
      return matchesSearch && matchesStatus;
    });
  }, [cupons, searchTerm, filterStatus]);

  return (
    <div className={styles.TableAdminCupomComponent}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Lista de Cupons</h2>
        <div className={styles.btnWrapper}>
          <Button
            label="Novo Cupom"
            icon={BsPlus}
            onClick={() => setCreateModalOpen(true)}
            variant="primary"
            className={styles.btn}
            disabled={!user?.token}
          />
        </div>
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : error ? (
          <p className={styles.errorState}>{error}</p>
        ) : (
          <HeaderTableAdminCupom
            cupons={filteredCupons}
            deleteRow={handleDeleteRow}
            editRow={handleEditRow}
          />
        )}
      </div>
      {createModalOpen && (
        <AddCouponModal
          key="create"
          onClose={() => setCreateModalOpen(false)}
          submitting={formSubmitting}
          onAdd={handleAddCoupon}
        />
      )}
      {editModalOpen && couponBeingEdited && (
        <AddCouponModal
          key={`edit-${couponBeingEdited.id}`}
          onClose={() => {
            setEditModalOpen(false);
            setCouponBeingEdited(null);
          }}
          submitting={formSubmitting}
          onAdd={handleUpdateCoupon}
          initialValues={{
            name: couponBeingEdited.cupom,
            discount: couponBeingEdited.valorDesc,
            validity: couponBeingEdited.validadeISO,
            status: couponBeingEdited.ativo ? 'ativo' : 'inativo',
            unique: couponBeingEdited.unicoBool,
          }}
          title="Editar Cupom"
          submitLabel="Salvar alterações"
        />
      )}
      <DeleteModal
        item={couponToDelete?.cupom ?? 'este cupom'}
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) {
            setCouponToDelete(null);
          }
        }}
        onClickConfirm={() => {
          if (!deletingCoupon) {
            void handleDeleteCoupon();
          }
        }}
      />
    </div>
  );
}

export default TableAdminCupomComponent;
