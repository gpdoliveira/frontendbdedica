import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Registro() {
  const [username, setUsername] = useState('');
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('ORIENTADOR');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== password2) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await api.post('/api/criar/', {
        username,
        nome,
        cargo,
        password,
        password2
      });

      console.log('Usuário criado:', response.data);
      setSuccess('Usuário criado com sucesso!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 403) {
        setError('Você não tem permissão para criar usuários.');
      } else if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        setError('Erro ao criar usuário. Verifique os dados.');
      }
    }
  };

  return (
    <div className="login-layout">
      <div className="login-card">
        <h2>Registrar Usuário</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite o username"
              required
            />

            <label>Nome completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome completo"
              required
            />

            <label>Cargo</label>
            <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
              <option value="ORIENTADOR">Orientador</option>
              <option value="COORDENADOR">Coordenador</option>
              <option value="JIJ">JIJ</option>
            </select>

            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              required
            />

            <label>Confirmar Senha</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Confirme a senha"
              required
            />

            {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
            {success && <p style={{ color: 'green', fontSize: '0.9rem' }}>{success}</p>}

            <button type="submit" className="primary">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
