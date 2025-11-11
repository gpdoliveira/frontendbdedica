// src/pages/AberturaProcesso.jsx
import { useEffect, useState } from "react";
import api from "../api/api";

export default function AberturaProcesso() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // 🔹 Recupera token JWT do localStorage
        const userData = localStorage.getItem("usuario");
        const headers = {};
        if (userData) {
          const { accessToken } = JSON.parse(userData);
          if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
          }
        }

        // 🔹 Busca templates reais no backend
        const response = await api.get("/api/processos/templates/", { headers });
        setTemplates(response.data);
      } catch (err) {
        console.error("Erro ao carregar templates:", err);
        setError("Não foi possível carregar os templates de processo.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // 🔹 Interface mantida exatamente como o design original
  return (
    <>
      <h2>Abertura de Processo</h2>
      <p>Selecione um modelo de processo para iniciar.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && !error && <p>Carregando templates...</p>}

      {!loading && !error && templates.length === 0 && (
        <p>Nenhum template disponível.</p>
      )}

      {!loading && !error && templates.length > 0 && (
        <ul className="card-list">
          {templates.map((template) => (
            <li key={template.id} className="card">
              <h3>{template.nome}</h3>
              <p>{template.descricao}</p>
              <button
                className="primary"
                onClick={() => {
                  localStorage.setItem(
                    "templateSelecionado",
                    JSON.stringify(template)
                  );
                  window.location.href = "/criar-processo";
                }}
              >
                Iniciar Processo
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
