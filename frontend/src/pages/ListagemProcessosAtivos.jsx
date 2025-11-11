import { useEffect, useState } from "react";
import api from "../api/api";

export default function ListagemProcessosAtivos() {
  const [processos, setProcessos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        // 🔹 Recupera token JWT
        const userData = localStorage.getItem("usuario");
        const headers = {};
        if (userData) {
          const { accessToken } = JSON.parse(userData);
          if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
        }

        // 🔹 Requisição autenticada
        const response = await api.get(
          "/api/processos/processos/?status_proc=PENDENTE",
          { headers }
        );
        setProcessos(response.data);
      } catch (err) {
        console.error("Erro ao carregar processos:", err);
        setError("Não foi possível carregar os processos ativos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProcessos();
  }, []);

  return (
    <div className="page">
      <h2>Processos Ativos</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && !error && <p>Carregando processos...</p>}

      {!loading && !error && processos.length === 0 && (
        <p>Nenhum processo ativo encontrado.</p>
      )}

      {!loading && processos.length > 0 && (
        <ul className="card-list">
          {processos.map((proc) => (
            <li
              key={proc.id}
              className="card"
              onClick={() =>
                (window.location.href = `/visualizar-processo/${proc.id}`)
              }
            >
              <h3>{proc.tipo_processo}</h3>
              <p>
                <strong>Status:</strong> {proc.status_proc}
              </p>
              <p>
                <strong>Iniciado por:</strong> {proc.iniciado_por}
              </p>
              <p>
                <strong>Data de Início:</strong>{" "}
                {new Date(proc.data_inicio).toLocaleString("pt-BR")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
