import './index.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import CadastroClientes from "./pages/CadastroClientes";
import CadastroEquipamentos from "./pages/CadastroEquipamentos";
import AberturaOrdem from "./pages/AberturaOrdem";
import AtendimentoOS from './pages/AtendimentoOS';
import ListarClientes from "./pages/ListarClientes";
import EditarCliente from './pages/EditarCliente';
import ListarEquipamentosPorCliente from './pages/ListarEquipamentosPorCliente';
import EditarEquipamento from './pages/EditarEquipamento';
import CadastroAnalisador from './pages/CadastroAnalisador';
import CadastroParametro from './pages/CadastroParametro';
import CadastroModeloParametro from './pages/CadastroModeloParametro';
import CadastroValorModelo from './pages/CadastroValorModelo';
import RealizarCalibracao from "./pages/RealizarCalibracao";
import ListarAnalisadores from './pages/ListarAnalisadores';
import RealizarPreventiva from "./pages/RealizarPreventiva";
import CriarModeloPreventiva from "./pages/CriarModeloPreventiva";
import GerenciarItensModelo from "./pages/GerenciarItensModelo";
import EditarAnalisador from './pages/EditarAnalisador';
import VisualizarCliente from './pages/VisualizarCliente';
import VisualizarAnalisador from './pages/VisualizarAnalisador';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                
                {/* Rotas protegidas */}
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/cadastro-clientes" element={<CadastroClientes />} />
                    <Route path="/cadastro-equipamentos" element={<CadastroEquipamentos />} />
                    <Route path="/abertura-ordem" element={<AberturaOrdem />} />
                    <Route path="/atendimento/:id" element={<AtendimentoOS />} />
                    <Route path="/listar-clientes" element={<ListarClientes />} />
                    <Route path="/editar-cliente/:id" element={<EditarCliente />} />
                    <Route path="/equipamentos-por-cliente" element={<ListarEquipamentosPorCliente />} />
                    <Route path="/editar-equipamento/:id" element={<EditarEquipamento />} />
                    <Route path="/cadastrar-analisadores" element={<CadastroAnalisador />} />
                    <Route path="/cadastrar-parametro" element={<CadastroParametro />} />
                    <Route path="/cadastrar-modelo" element={<CadastroModeloParametro />} />
                    <Route path="/cadastrar-valores/:id" element={<CadastroValorModelo />} />
                    <Route path="/realizar-calibracao/:id" element={<RealizarCalibracao />} />
                    <Route path="/listar-analisadores" element={<ListarAnalisadores />} />
                    <Route path="/realizar-preventiva/:id" element={<RealizarPreventiva />} />
                    <Route path="/criar-modelo-preventiva" element={<CriarModeloPreventiva />} />
                    <Route path="/gerenciar-itens-modelo/:id" element={<GerenciarItensModelo />} />
                    <Route path="/editar-analisador/:id" element={<EditarAnalisador />} />
                    <Route path="/visualizar-cliente/:id" element={<VisualizarCliente />} />
                    <Route path="/visualizar-analisador/:id" element={<VisualizarAnalisador />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
