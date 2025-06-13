import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import NavBar from "../components/NavBar";
import SelecionarClientes from "../components/SelecionarClientes";
import SelecionarEquipamentos from "../components/SelecionarEquipamentos";
import { FiClipboard, FiTool, FiUser, FiAlertCircle } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AbrirOrdemServico = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const [equipamentos, setEquipamentos] = useState([]);
    const [ordem, setOrdem] = useState({
        tipo: "",
        motivo: "",
        status: "aberta",
        cliente: "",
        equipamento: "",
    });

    const TIPOS = [
        "corretiva interna", "corretiva externa",
        "preventiva interna", "preventiva externa"
    ];

    const STATUS = [
        "aberta", "aguardando envio do laudo", "executado - aguardando faturamento",
        "aguardando envio do orçamento", "aguardando aprovação",
        "aguardando peça para continuar orçamento", "aprovado - aguardando execução",
        "reprovado", "finalizado"
    ];

    const handleChange = (e) => {
        setOrdem({ ...ordem, [e.target.name]: e.target.value });
        setFormChanged(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post("/api/ordens/", ordem, {
                
            });
            toast.success("Ordem de Serviço criada com sucesso!");
            setFormChanged(false);
            navigate("/dashboard");
        } catch (error) {
            console.error("Erro ao criar ordem de serviço:", error);
            toast.error("Erro ao criar ordem de serviço: " + (error.response?.data?.message || "Erro desconhecido"));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (formChanged) {
            if (window.confirm("Tem certeza que deseja sair? As alterações não serão salvas.")) {
                navigate("/dashboard");
            }
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <ToastContainer position="top-right" autoClose={5000} />

            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <span onClick={() => handleCancel()} className="cursor-pointer hover:text-blue-600">Dashboard</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Abertura de Ordem de Serviço</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Abertura de Ordem de Serviço</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiClipboard className="text-blue-600" />
                                    Dados da Ordem
                                </div>
                            </legend>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Serviço <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="tipo"
                                        value={ordem.tipo}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">Selecione o Tipo</option>
                                        {TIPOS.map(tipo => (
                                            <option key={tipo} value={tipo} className="capitalize">{tipo}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={ordem.status}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        {STATUS.map(status => (
                                            <option key={status} value={status} className="capitalize">{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiUser className="text-blue-600" />
                                    Cliente e Equipamento
                                </div>
                            </legend>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cliente <span className="text-red-500">*</span>
                                    </label>
                                    <SelecionarClientes 
                                        onClienteSelecionado={(clienteId) => {
                                            setOrdem({ ...ordem, cliente: clienteId, equipamento: "" });
                                            setFormChanged(true);
                                            axiosInstance.get(`/api/equipamentos/por_cliente/?cliente_id=${clienteId}`, {
                                                
                                            })
                                                .then(response => setEquipamentos(response.data))
                                                .catch(error => {
                                                    console.error("Erro ao buscar equipamentos:", error);
                                                    toast.error("Erro ao buscar equipamentos do cliente");
                                                });
                                        }}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Equipamento <span className="text-red-500">*</span>
                                    </label>
                                    <SelecionarEquipamentos
                                        clienteId={ordem.cliente}
                                        equipamentos={equipamentos}
                                        onEquipamentoSelecionado={(id) => {
                                            setOrdem({ ...ordem, equipamento: id });
                                            setFormChanged(true);
                                        }}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiAlertCircle className="text-blue-600" />
                                    Motivo
                                </div>
                            </legend>
                            <div className="mt-4">
                                <textarea
                                    name="motivo"
                                    placeholder="Descreva detalhadamente o motivo da ordem de serviço..."
                                    value={ordem.motivo}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </fieldset>

                        <div className="flex gap-4 justify-end">
                            <button 
                                type="button" 
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`
                                    bg-blue-600 text-white px-6 py-2 rounded-md
                                    hover:bg-blue-700 focus:ring-4 focus:ring-blue-200
                                    transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                    flex items-center gap-2
                                `}
                            >
                                {loading ? "Criando..." : "Criar Ordem de Serviço"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AbrirOrdemServico;
