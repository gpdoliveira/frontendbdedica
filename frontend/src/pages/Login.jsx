import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Mapeamento local de usuários (baseado no banco de inserts)
  const usuariosInfo = {
    "j.silva": { nome: "João Silva", cargo: "ORIENTADOR" },
    "a.braga": { nome: "Ana Braga", cargo: "ORIENTADOR" },
    "f.oliveira": { nome: "Fernanda Oliveira", cargo: "COORDENADOR" },
    "b.rodrigues": { nome: "Bruno Rodrigues", cargo: "COORDENADOR" },
    "m.souza": { nome: "Mariana Souza", cargo: "JIJ" },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/login/", { username, password });
      const { access, refresh } = res.data;

      // Busca nome e cargo do dicionário local
      const userInfo = usuariosInfo[username] || {
        nome: username,
        cargo: "Usuário",
      };

      // Salva todos os dados no localStorage
      const usuarioData = {
        username,
        nome: userInfo.nome,
        cargo: userInfo.cargo,
        accessToken: access,
        refreshToken: refresh,
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioData));
      navigate("/");
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Usuário ou senha inválidos.");
    }
  };

  return (
    <div className="login-layout">
      <div className="login-card">
        <h2>BDedica</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu usuário"
            required
          />

          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className="primary">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
