// src/pages/CriacaoProcesso.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CriacaoProcesso() {
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Recupera o template salvo na tela anterior
    const storedTemplate = localStorage.getItem("templateSelecionado");
    if (storedTemplate) {
      setTemplate(JSON.parse(storedTemplate));
    } else {
      setError("Nenhum template selecionado.");
    }
  }, []);

  const handleCriarProcesso = async () => {
    if (!template) return;

    try {
      setLoading(true);
      setError("");

      // 🔹 Recupera token JWT do usuário logado
      const userData = localStorage.getItem("usuario");
      const headers = {};
      if (userData) {
        const { accessToken } = JSON.parse(userData);
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      }

      // 🔹 Corpo conforme o backend (DOC.md)
      const data = {
        id_template: template.id,
        observacoes: "Processo iniciado via frontend",
        anexo: null,
      };

      // ✅ Endpoint correto (plural)
      const response = await api.post(
        "/api/processos/exec_etapas/iniciar/",
        data,
        { headers }
      );

      console.log("Processo criado:", response.data);
      setSuccess("Processo criado com sucesso!");

      // 🔹 Redireciona após 1,5s
      setTimeout(() => navigate("/ativos"), 1500);
    } catch (err) {
      console.error("Erro ao criar processo:", err);
      setError("Falha ao criar o processo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Criação de Processo</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {template ? (
        <div className="template-detalhes">
          <h3>{template.nome}</h3>
          <p>{template.descricao}</p>

          <button
            className="primary"
            onClick={handleCriarProcesso}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Confirmar Criação"}
          </button>
        </div>
      ) : (
        !error && <p>Carregando template...</p>
      )}
    </div>
  );
}
