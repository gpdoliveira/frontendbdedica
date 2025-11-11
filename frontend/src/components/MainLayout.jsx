import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      setUsuario(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">BDedica</div>
        <nav>
          <Link to="/">Abertura de Processo</Link>
          <Link to="/criar-processo">Criação de Processo</Link>
          <Link to="/ativos">Processos Ativos</Link>
          <Link to="/historico">Histórico</Link>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <header className="navbar">
          <h1>Sistema BDedica</h1>

          {usuario && (
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontWeight: 500 }}>
                {usuario.nome} ({usuario.cargo})
              </p>
              <button
                onClick={handleLogout}
                className="danger"
                style={{ marginTop: "0.5rem" }}
              >
                Sair
              </button>
            </div>
          )}
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
