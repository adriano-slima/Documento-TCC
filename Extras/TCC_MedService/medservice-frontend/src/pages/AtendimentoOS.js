import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import NavBar from "../components/NavBar";
import { FiClipboard, FiTool, FiCalendar, FiUser, FiPackage, FiEdit2, FiArrowLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AtendimentoOS = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ordem, setOrdem] = useState(null);
    const [novoStatus, setNovoStatus] = useState("");
    const [descricaoApontamento, setDescricaoApontamento] = useState("");
    const [apontamentos, setApontamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApontamentos = async () => {
        try {
            const response = await axiosInstance.get(`/api/apontamentos/?ordem_servico=${id}`);
            setApontamentos(response.data);
        } catch (error) {
            console.error("Erro ao buscar apontamentos:", error);
            if (error.response?.status === 401) {
                alert("Sua sessão expirou. Por favor, faça login novamente.");
                navigate("/");
            } else {
                alert("Erro ao carregar os apontamentos.");
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const ordemResponse = await axiosInstance.get(`/api/ordens/${id}/`);
                setOrdem(ordemResponse.data);
                setNovoStatus(ordemResponse.data.status);
                await fetchApontamentos();
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                if (error.response?.status === 401) {
                    alert("Sua sessão expirou. Por favor, faça login novamente.");
                    navigate("/");
                } else {
                    alert("Erro ao carregar os dados da ordem de serviço.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSalvar = async () => {
        try {
            await axiosInstance.patch(`/api/ordens/${id}/`, {
                status: novoStatus,
            });

            if (descricaoApontamento.trim()) {
                await axiosInstance.post("/api/apontamentos/", {
                    ordem_servico: id,
                    descricao: descricaoApontamento,
                    status_no_momento: novoStatus
                });
                setDescricaoApontamento("");
                await fetchApontamentos();
            }

            toast.success("Alterações salvas com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            if (error.response?.status === 401) {
                toast.error("Sua sessão expirou. Por favor, faça login novamente.");
                navigate("/");
            } else {
                toast.error("Erro ao salvar alterações.");
            }
        }
    };

    const handleExcluirApontamento = async (apontamentoId) => {
        if (!window.confirm("Deseja realmente excluir este apontamento?")) return;
        try {
            await axiosInstance.delete(`/api/apontamentos/${apontamentoId}/`);
            await fetchApontamentos();
        } catch (error) {
            console.error("Erro ao excluir apontamento:", error);
            if (error.response?.status === 401) {
                alert("Sua sessão expirou. Por favor, faça login novamente.");
                navigate("/");
            } else {
                alert("Erro ao excluir apontamento.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NavBar />
                <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!ordem) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NavBar />
                <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                    <div className="text-center text-red-500">Ordem de serviço não encontrada.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <ToastContainer position="top-right" autoClose={5000} />

            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <span onClick={() => navigate("/dashboard")} className="cursor-pointer hover:text-blue-600">Dashboard</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Atendimento - O.S. #{ordem.id}</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Atendimento - O.S. #{ordem.id}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="text-blue-600" />
                                    Dados da Ordem
                                </div>
                            </legend>
                            <div className="space-y-2">
                                <p className="text-gray-600"><span className="font-medium">Data:</span> {new Date(ordem.data_abertura).toLocaleDateString()}</p>
                                <p className="text-gray-600"><span className="font-medium">Status:</span> {ordem.status}</p>
                                <p className="text-gray-600"><span className="font-medium">Motivo:</span> {ordem.motivo}</p>
                            </div>
                        </fieldset>

                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiUser className="text-blue-600" />
                                    Cliente
                                </div>
                            </legend>
                            <div className="space-y-2">
                                <p className="text-gray-600"><span className="font-medium">Nome:</span> {ordem.cliente_nome}</p>
                                <p className="text-gray-600"><span className="font-medium">CNPJ/CPF:</span> {ordem.cliente_cnpj_cpf}</p>
                            </div>
                        </fieldset>
                    </div>

                    <fieldset className="border border-gray-200 p-6 rounded-lg mb-6">
                        <legend className="text-lg font-semibold text-gray-700 px-2">
                            <div className="flex items-center gap-2">
                                <FiPackage className="text-blue-600" />
                                Equipamento
                            </div>
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p className="text-gray-600"><span className="font-medium">Tipo:</span> {ordem.equipamento_tipo}</p>
                            <p className="text-gray-600"><span className="font-medium">Marca:</span> {ordem.equipamento_marca}</p>
                            <p className="text-gray-600"><span className="font-medium">Modelo:</span> {ordem.equipamento_modelo}</p>
                            <p className="text-gray-600"><span className="font-medium">Número de Série:</span> {ordem.equipamento_numero_serie}</p>
                        </div>
                    </fieldset>

                    <fieldset className="border border-gray-200 p-6 rounded-lg mb-6">
                        <legend className="text-lg font-semibold text-gray-700 px-2">
                            <div className="flex items-center gap-2">
                                <FiEdit2 className="text-blue-600" />
                                Atualizar Status e Apontamentos
                            </div>
                        </legend>
                        <div className="space-y-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={novoStatus}
                                    onChange={(e) => setNovoStatus(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="aberta">Aberta</option>
                                    <option value="aguardando envio do laudo">Aguardando Envio do Laudo</option>
                                    <option value="executado - aguardando faturamento">Executado - Aguardando Faturamento</option>
                                    <option value="aguardando envio do orçamento">Aguardando Envio do Orçamento</option>
                                    <option value="aguardando aprovação">Aguardando Aprovação</option>
                                    <option value="aguardando peça para continuar orçamento">Aguardando Peça</option>
                                    <option value="aprovado - aguardando execução">Aprovado - Aguardando Execução</option>
                                    <option value="reprovado">Reprovado</option>
                                    <option value="finalizado">Finalizado</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apontamento</label>
                                <textarea
                                    value={descricaoApontamento}
                                    onChange={(e) => setDescricaoApontamento(e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Descreva o que foi realizado no atendimento..."
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSalvar}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition duration-200"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="border border-gray-200 p-6 rounded-lg mb-6">
                        <legend className="text-lg font-semibold text-gray-700 px-2">
                            <div className="flex items-center gap-2">
                                <FiClipboard className="text-blue-600" />
                                Apontamentos Realizados
                            </div>
                        </legend>
                        {apontamentos.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Nenhum apontamento encontrado.</p>
                        ) : (
                            <div className="space-y-4">
                                {apontamentos.map(ap => (
                                    <div key={ap.id} className="border p-4 rounded-md shadow-sm bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <p><span className="font-medium">Usuário:</span> {ap.usuario_nome}</p>
                                                <p><span className="font-medium">Status:</span> {ap.status_no_momento}</p>
                                                <p><span className="font-medium">Data:</span> {new Date(ap.data).toLocaleString()}</p>
                                            </div>
                                            <button
                                                onClick={() => handleExcluirApontamento(ap.id)}
                                                className="text-red-600 hover:text-red-800 transition duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-gray-700"><span className="font-medium">Descrição:</span> {ap.descricao}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </fieldset>

                    <div className="flex gap-4 justify-end">
                        <button
                            onClick={() => navigate(`/realizar-calibracao/${id}`)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 shadow-md flex items-center gap-2"
                        >
                            <FiTool size={20} />
                            Realizar Calibração
                        </button>

                        <button
                            onClick={() => navigate(`/realizar-preventiva/${id}`)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 shadow-md flex items-center gap-2"
                        >
                            <FiTool size={20} />
                            Realizar Preventiva
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AtendimentoOS;
