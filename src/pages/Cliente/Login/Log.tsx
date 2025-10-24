import React, { useState } from 'react';
import styles from './Log.module.scss';
import logoImage from '../../../assets/images/logo-se-doce-fosse-sem-fundodark.png';
import { useNavigate } from 'react-router-dom';
import { loginCliente } from '../../../services/auth/auth';
import { useCliente } from '../../../context/ClienteContext';

type Customer = {
  id?: string;
  nome: string;
  telefone: string;
};

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
  });
  const [errors, setErrors] = useState({
    nome: '',
    telefone: '',
    general: '',
  });
  const [touched, setTouched] = useState({
    nome: false,
    telefone: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'nome': {
        if (!value.trim()) return 'Nome é obrigatório';
        if (value.trim().length < 2)
          return 'Nome deve ter pelo menos 2 caracteres';
        return '';
      }
      case 'telefone': {
        const phoneNumbers = value.replace(/\D/g, '');
        if (!phoneNumbers) return 'Telefone é obrigatório';
        if (phoneNumbers.length < 10)
          return 'Telefone deve ter pelo menos 10 dígitos';
        if (phoneNumbers.length > 11)
          return 'Telefone deve ter no máximo 11 dígitos';
        return '';
      }
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'telefone' ? formatTelefone(value) : value;

    setFormData((p) => ({ ...p, [name]: newValue }));

    if (touched[name as keyof typeof touched]) {
      const err = validateField(name, newValue);
      setErrors((p) => ({ ...p, [name]: err }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    const err = validateField(name, value);
    setErrors((p) => ({ ...p, [name]: err }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    if (name !== 'telefone') return;

    if (e.key === 'Backspace' || e.key === 'Delete') {
      const input = e.currentTarget as HTMLInputElement;
      const cursorPosition = input.selectionStart || 0;
      const value = input.value;
      if (e.key === 'Backspace') {
        const charAtCursor = value[cursorPosition - 1];
        if (charAtCursor && /[() -]/.test(charAtCursor)) {
          const newValue =
            value.slice(0, cursorPosition - 2) + value.slice(cursorPosition);
          const formatted = formatTelefone(newValue);
          setFormData((p) => ({ ...p, telefone: formatted }));

          if (touched.telefone) {
            const err = validateField('telefone', formatted);
            setErrors((p) => ({ ...p, telefone: err }));
          }

          e.preventDefault();
          setTimeout(() => {
            const newCursor = Math.max(0, cursorPosition - 2);
            input.setSelectionRange(newCursor, newCursor);
          }, 0);
        }
      }
    }
  };

  const isFormValid = () => {
    const nomeErr = validateField('nome', formData.nome);
    const telErr = validateField('telefone', formData.telefone);
    const phoneNumbers = formData.telefone.replace(/\D/g, '');
    return (
      !nomeErr &&
      !telErr &&
      formData.nome.trim() !== '' &&
      phoneNumbers.length >= 10
    );
  };

  const navigate = useNavigate();
  const { saveCliente } = useCliente();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ nome: true, telefone: true });

    const nomeError = validateField('nome', formData.nome);
    const telefoneError = validateField('telefone', formData.telefone);
    setErrors({ nome: nomeError, telefone: telefoneError, general: '' });

    if (nomeError || telefoneError) return;

    setIsLoading(true);
    try {
      const phoneNumbers = formData.telefone.replace(/\D/g, '');
      const customer: Customer = await loginCliente(
        formData.nome.trim(),
        phoneNumbers
      );

      const normalize = (s: string) =>
        s
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase()
          .trim();

      const enteredNameNorm = normalize(formData.nome);
      const returnedNameNorm = normalize(customer.nome || '');

      if (returnedNameNorm && enteredNameNorm !== returnedNameNorm) {
        setErrors((p) => ({
          ...p,
          general:
            'O telefone informado já está cadastrado com outro nome. Se este for o seu número, por favor utilize o nome cadastrado ou recupere o acesso. Caso contrário, entre em contato com o suporte.',
        }));
        return;
      }

      saveCliente(customer);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro no acesso';
      setErrors((p) => ({ ...p, general: `Erro no acesso: ${message}` }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.logoContainer}>
        <img src={logoImage} alt="Se Doce Fosse" className={styles.logo} />
        <p className={styles.logoText}>Doces artesanais feitos com amor</p>
        <p className={styles.logoSubText}>
          Cada doce é um reflexo de cuidado, paixão e criatividade!
        </p>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.mobileLogoSection}>
          <img
            src={logoImage}
            alt="Se Doce Fosse"
            className={styles.mobileLogo}
          />
          <p className={styles.mobileLogoText}>
            Doces artesanais feitos com amor
          </p>
          <p className={styles.mobileLogoSubText}>
            Cada doce é um reflexo de cuidado, paixão e criatividade!
          </p>
        </div>

        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h1 className={styles.title}>Entre com sua conta</h1>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="nome" className={styles.label}>
                Nome <span className={styles.required}>*</span>
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.input} ${errors.nome ? styles.inputError : ''}`}
                required
                disabled={isLoading}
              />
              {errors.nome && (
                <span className={styles.errorMessage}>{errors.nome}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefone" className={styles.label}>
                Telefone com (DDD) <span className={styles.required}>*</span>
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                value={formData.telefone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`${styles.input} ${errors.telefone ? styles.inputError : ''}`}
                placeholder="(11) 99999-9999"
                maxLength={15}
                required
                disabled={isLoading}
              />
              {errors.telefone && (
                <span className={styles.errorMessage}>{errors.telefone}</span>
              )}
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? 'Acessando...' : 'Acessar'}
            </button>
            {errors.general && (
              <div className={styles.formError} role="alert">
                {errors.general}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
