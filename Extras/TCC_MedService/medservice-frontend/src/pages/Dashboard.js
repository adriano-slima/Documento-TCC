import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import NavBar from "../components/NavBar";

export default function Dashboard() {
    const [ordens, setOrdens] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("todos");
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get("/api/ordens/", {
        })
            .then(res => {
                console.log("Dados da primeira ordem:", res.data[0]);
                setOrdens(res.data);
            })
            .catch(err => console.error("Erro ao buscar ordens:", err));
    }, );

    // Cores para cada status e sua ordem
    const statusOrdem = [
        "todos",
        "aberta",
        "aguardando peça para continuar orçamento",
        "aguardando envio do orçamento",
        "aguardando aprovação",
        "aprovado - aguardando execução",
        "executado - aguardando faturamento",
        "aguardando envio do laudo",
        "reprovado",
        "finalizado"
    ];

    const coresStatus = {
        "aberta": "text-yellow-500",
        "aguardando peça para continuar orçamento": "text-purple-500",
        "aguardando envio do orçamento": "text-orange-500",
        "aguardando aprovação": "text-yellow-500",
        "aprovado - aguardando execução": "text-blue-500",
        "executado - aguardando faturamento": "text-teal-500",
        "aguardando envio do laudo": "text-indigo-500",
        "reprovado": "text-red-500",
        "finalizado": "text-green-500"
    };

    // Contadores de status
    const contadores = ordens.reduce((acc, ordem) => {
        acc[ordem.status] = (acc[ordem.status] || 0) + 1;
        return acc;
    }, {});

    const totalOrdens = ordens.length;

    // Função para normalizar o status
    const normalizarStatus = (status) => {
        if (!status) return "";
        return status
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    };

    const ordensFiltradas = ordens.filter(ordem => {
        const texto = search.toLowerCase();
        const matchSearch = (
            ordem.id.toString().includes(texto) ||
            ordem.cliente_nome?.toLowerCase().includes(texto) ||
            ordem.status?.toLowerCase().includes(texto) ||
            ordem.equipamento_numero_serie?.toLowerCase().includes(texto) ||
            ordem.equipamento_modelo?.toLowerCase().includes(texto)
        );
        return matchSearch && (statusFiltro === "todos" || normalizarStatus(ordem.status) === normalizarStatus(statusFiltro));
    });

    // Log para debug
    console.log("Primeira ordem:", ordens[0]);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />

            {/* Conteúdo principal */}
            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all">
                <div className="max-w-7xl mx-auto">
                    {/* Cabeçalho */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Ordens de Serviço</h1>
                        <p className="text-gray-600">Gerencie todas as ordens de serviço para equipamentos médicos</p>
                    </div>

                    {/* Filtros de Status */}
                    <div className="grid grid-cols-5 gap-4 mb-8">
                        {statusOrdem.map((status) => {
                            if (status === "todos") {
                                return (
                                    <button
                                        key="todos"
                                        onClick={() => setStatusFiltro("todos")}
                                        className={`p-4 rounded-lg font-medium flex flex-col items-center justify-center space-y-2 h-24 
                                            bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-all`}
                                    >
                                        <span className="text-sm text-gray-600">Todos</span>
                                        <span className="text-lg font-bold text-gray-800">{totalOrdens}</span>
                                    </button>
                                );
                            }
                            return (
                                <button
                                    key={status}
                                    onClick={() => setStatusFiltro(status)}
                                    className={`p-4 rounded-lg font-medium flex flex-col items-center justify-center space-y-2 h-24 
                                        bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-all
                                        ${normalizarStatus(statusFiltro) === normalizarStatus(status) ? 'border-gray-400' : ''}`}
                                >
                                    <span className="text-sm text-gray-600">{status}</span>
                                    <span className={`text-lg font-bold ${coresStatus[status]}`}>{contadores[status] || 0}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Barra de pesquisa */}
                    <div className="mb-4">
                        <div className="relative w-96">
                            <input
                                type="text"
                                placeholder="Buscar ordem de serviço..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Tabela de Ordens */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Nº O.S.</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Data</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Cliente</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Equipamento</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Tipo O.S.</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ordensFiltradas.map((ordem) => (
                                        <tr 
                                            key={ordem.id} 
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => navigate(`/atendimento/${ordem.id}`)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-base font-semibold text-gray-900">
                                                    #{ordem.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-base text-gray-900">
                                                    {new Date(ordem.data_abertura).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-medium text-gray-900">
                                                        {ordem.cliente_nome}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        CNPJ/CPF: {ordem.cliente_cnpj_cpf}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-medium text-gray-900">
                                                        {ordem.equipamento_tipo}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        Modelo: {ordem.equipamento_modelo}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        Série: {ordem.equipamento_numero_serie}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-base text-gray-900">
                                                    {ordem.tipo === 'corretiva interna' && 'Corretiva Interna'}
                                                    {ordem.tipo === 'corretiva externa' && 'Corretiva Externa'}
                                                    {ordem.tipo === 'preventiva interna' && 'Preventiva Interna'}
                                                    {ordem.tipo === 'preventiva externa' && 'Preventiva Externa'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                                                    coresStatus[ordem.status]?.replace("text-", "bg-").replace("500", "100")
                                                } ${coresStatus[ordem.status]}`}>
                                                    {ordem.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
