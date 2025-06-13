import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import NavBar from "../components/NavBar";
import SelecionarClientes from "../components/SelecionarClientes";
import { FiTool, FiTag, FiHash, FiUser } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CadastroEquipamentos = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const [errors, setErrors] = useState({});

    const [equipamento, setEquipamento] = useState({
        tipo: "",
        marca: "",
        modelo: "",
        numero_serie: "",
        patrimonio: "",
        proprietario: "",
    });

    const handleClienteSelecionado = (clienteId) => {
        setEquipamento(prev => ({ ...prev, proprietario: clienteId }));
        setFormChanged(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEquipamento(prev => ({ ...prev, [name]: value }));
        setFormChanged(true);
        
        // Validação em tempo real
        if (!value) {
            setErrors(prev => ({ ...prev, [name]: "Este campo é obrigatório" }));
        } else {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Confirmação antes de sair
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (formChanged) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [formChanged]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação final
        const finalErrors = {};
        Object.keys(equipamento).forEach(key => {
            if (!equipamento[key]) {
                finalErrors[key] = "Este campo é obrigatório";
            }
        });

        if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);
            toast.error("Por favor, preencha todos os campos obrigatórios");
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post("/api/equipamentos/", equipamento);
            toast.success("Equipamento cadastrado com sucesso!");
            setFormChanged(false);
            navigate("/dashboard");
        } catch (error) {
            console.error("Erro ao cadastrar equipamento:", error.response?.data || error.message);
            toast.error("Erro ao cadastrar equipamento: " + (error.response?.data?.message || "Erro desconhecido"));
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
            <NavBar/>
            <ToastContainer position="top-right" autoClose={5000} />

            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <span onClick={() => handleCancel()} className="cursor-pointer hover:text-blue-600">Dashboard</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Cadastro de Equipamentos</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Equipamentos</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiTool className="text-blue-600" />
                                    Dados do Equipamento
                                </div>
                            </legend>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Equipamento <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="tipo" 
                                        value={equipamento.tipo} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.tipo ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        required 
                                    />
                                    {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Marca <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="marca" 
                                        value={equipamento.marca} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.marca ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        required 
                                    />
                                    {errors.marca && <p className="text-red-500 text-sm mt-1">{errors.marca}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Modelo <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="modelo" 
                                        value={equipamento.modelo} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.modelo ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        required 
                                    />
                                    {errors.modelo && <p className="text-red-500 text-sm mt-1">{errors.modelo}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Número de Série <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="numero_serie" 
                                        value={equipamento.numero_serie} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.numero_serie ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        required 
                                    />
                                    {errors.numero_serie && <p className="text-red-500 text-sm mt-1">{errors.numero_serie}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Patrimônio <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="patrimonio" 
                                        value={equipamento.patrimonio} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.patrimonio ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        required 
                                    />
                                    {errors.patrimonio && <p className="text-red-500 text-sm mt-1">{errors.patrimonio}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Proprietário <span className="text-red-500">*</span>
                                    </label>
                                    <SelecionarClientes 
                                        onClienteSelecionado={handleClienteSelecionado}
                                        className={`w-full border ${errors.proprietario ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.proprietario && <p className="text-red-500 text-sm mt-1">{errors.proprietario}</p>}
                                </div>
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
                                {loading ? "Cadastrando..." : "Cadastrar Equipamento"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CadastroEquipamentos;