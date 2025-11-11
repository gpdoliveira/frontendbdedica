// src/pages/HistoricoProcessos.jsx

export default function HistoricoProcessos() {
  const processos = [
    { id: 98, nome: "Relatório Fev/2025 - João Silva", status: "Concluído", data: "10/03/2025" },
    { id: 97, nome: "Relatório Jan/2025 - Maria Souza", status: "Concluído", data: "11/02/2025" },
    { id: 95, nome: "Relatório Jan/2025 - João Silva", status: "Concluído", data: "10/02/2025" },
    { id: 94, nome: "Ajuste Cadastral - Antônia", status: "Concluído", data: "05/01/2025" },
    { id: 93, nome: "Relatório Dez/2024 - Pedro", status: "Concluído", data: "15/01/2025" },
  ];

  return (
    <>
      <h2>Histórico de Processos</h2>
      <p>Lista de processos já finalizados.</p>

      <table>
        <thead>
          <tr>
            <th>ID Processo</th>
            <th>Nome</th>
            <th>Status Final</th>
            <th>Data de Conclusão</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {processos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>{p.status}</td>
              <td>{p.data}</td>
              <td>
                <button>Ver Detalhes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}