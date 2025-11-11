// src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Importe o novo layout e a nova página de login
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Registro from './pages/Registro';

// Importe as páginas que agora são filhas do MainLayout
import AberturaProcesso from './pages/AberturaProcesso';
import CriacaoProcesso from './pages/CriacaoProcesso';
import ListagemProcessosAtivos from './pages/ListagemProcessosAtivos';
import HistoricoProcessos from './pages/HistoricoProcessos';
import VisualizacaoEtapa from './pages/VisualizacaoEtapa';


function App() {
  return (
    <Routes>
      {/* Rota 1: A tela de Login (caminho: /login) */}
      {/* Ela é renderizada sem a sidebar e navbar */}
      <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

      {/* Rota 2: O Layout Principal (caminho: /) */}
      {/* Ele contém a sidebar/navbar e renderiza as rotas filhas */}
      <Route path="/" element={<MainLayout />}>
        {/* As rotas filhas são renderizadas dentro do <Outlet /> do MainLayout */}
        <Route index element={<AberturaProcesso />} /> {/* 'index' é a rota padrão '/' */}
        <Route path="ativos" element={<ListagemProcessosAtivos />} />
        <Route path="historico" element={<HistoricoProcessos />} />
        <Route path="criar-processo" element={<CriacaoProcesso />} />
        <Route path="etapa/:id" element={<VisualizacaoEtapa />} />
          <Route path="/visualizar-processo/:id" element={<VisualizacaoEtapa />} />
      </Route>
    </Routes>
  );
}

export default App;