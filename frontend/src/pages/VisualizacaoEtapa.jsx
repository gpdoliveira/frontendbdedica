import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function VisualizacaoEtapa() {
  const { id } = useParams(); // id do processo
  const [etapas, setEtapas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [arquivo, setArquivo] = useState(null); // novo estado

  useEffect(() => {
    carregarProcesso();
  }, [id]);

  const carregarProcesso = async () => {
    try {
      const response = await api.get(`/api/processos/processos/${id}/`);
      setEtapas(response.data.historico_etapas || []);
    } catch (err) {
      console.error("Erro ao carregar processo:", err);
      setErro("Erro ao carregar o processo.");
    }
  };

  const finalizarEtapa = async () => {
    setErro("");
    setMensagem("");
    setLoading(true);

    try {
      const processo = await api.get(`/api/processos/processos/${id}/`);
      const etapaPendente = processo.data.historico_etapas?.find(
        (e) => e.Status === "PENDENTE"
      );
      if (!etapaPendente) {
        setErro("Nenhuma etapa pendente para finalizar.");
        setLoading(false);
        return;
      }

      const caixaResp = await api.get(`/api/processos/exec_etapas/caixa-de-entrada/`);
      const exec = (caixaResp.data || []).find(
        (item) => item.Id_Processo === parseInt(id)
      );

      if (!exec) {
        setErro("Execução pendente não encontrada (verifique o cargo).");
        setLoading(false);
        return;
      }

      const id_exec = exec.id_exec;
      if (!id_exec) {
        setErro("O backend não retornou o campo 'id_exec'.");
        setLoading(false);
        return;
      }

      // 🔹 Se a etapa exige anexo, validar o envio
      if (etapaPendente?.campo_anexo && !arquivo) {
        setErro("Esta etapa exige envio de anexo. Selecione um arquivo antes de finalizar.");
        setLoading(false);
        return;
      }

      // 🔹 Monta o payload com FormData (permite enviar arquivo)
      const formData = new FormData();
      formData.append(
        "observacoes",
        `Etapa '${etapaPendente.Etapa}' concluída via frontend.`
      );
      if (arquivo) formData.append("anexo", arquivo);

      const response = await api.post(
        `/api/processos/exec_etapas/${id_exec}/finalizar/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Etapa finalizada:", response.data);
      setMensagem("Etapa finalizada com sucesso!");
      setArquivo(null);
      await carregarProcesso();
    } catch (err) {
      console.error("❌ Erro ao finalizar etapa:", err);
      if (err.response) {
        setErro(err.response.data.detail || "Erro ao finalizar etapa.");
      } else {
        setErro("Falha de conexão com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Visualização do Processo #{id}</h2>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}

      {etapas.length > 0 ? (
        <ul>
          {etapas.map((e, i) => (
            <li key={i}>
              <strong>{e.Etapa}</strong> — {e.Status} <br />
              <small>Responsável: {e.Encaminhado_por || "Desconhecido"}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>Carregando etapas...</p>
      )}

      {/* 🔹 Campo de upload para o anexo */}
      <div style={{ marginTop: "1rem" }}>
        <label>
          Enviar anexo (opcional):
          <input
            type="file"
            onChange={(e) => setArquivo(e.target.files[0])}
            style={{ display: "block", marginTop: "0.5rem" }}
          />
        </label>
      </div>

      <button
        onClick={finalizarEtapa}
        className="primary"
        disabled={loading}
        style={{ marginTop: "1rem" }}
      >
        {loading ? "Finalizando..." : "Finalizar Etapa"}
      </button>
    </div>
  );
}
