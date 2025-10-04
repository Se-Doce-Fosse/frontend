import { useState } from 'react';
import { Input } from '../../components/Input';
import styles from './Login.module.scss';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { login as loginApi } from '../../services/auth/auth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const navigate = useNavigate();
  const { saveUser, isAuthenticated } = useUser();

  if (isAuthenticated) navigate('/admin/dashboard');

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)*\.[A-Z]{2,}$/i;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string; general?: string } =
      {};

    if (!emailRegex.test(email)) {
      newErrors.email = 'Digite um email válido';
    }
    if (!password.trim()) {
      newErrors.password = 'A senha não pode estar vazia';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const { token } = await loginApi(email, password);
        saveUser({ email, token });
        navigate('/admin/dashboard');
      } catch (err: unknown) {
        let message = 'Erro ao fazer login';
        if (err instanceof Error) {
          if (
            err.message === 'Failed to fetch' ||
            err.message.includes('NetworkError') ||
            err.message.includes('Network request failed')
          ) {
            message =
              'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
          } else {
            message = err.message;
          }
        }
        setErrors({ general: message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>Se Doce Fosse</h1>
            <hr className={styles.divider} />
            <h2 className={styles.subtitle}>Painel Administrativo</h2>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Email"
              placeholder="seuemail@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="suasenha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <Button label="Entrar" type="submit" loading={loading} />
            {errors.general && (
              <div className={styles.error}>{errors.general}</div>
            )}
          </form>

          <p className={styles.helper}>
            Não possui conta? Entre em contato com um Administrador
          </p>
        </div>
      </div>

      <p className={styles.notice}>Acesso restrito a pessoas autorizadas</p>
    </div>
  );
};

export default Login;
