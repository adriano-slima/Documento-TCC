import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import NavBar from "../components/NavBar";
import { FiClipboard, FiEdit2, FiEye, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CriarModeloPreventiva() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const [errors, setErrors] = useState({});
    const [modelos, setModelos] = useState([]);
    const [modelo, setModelo] = useState({
        nome: ""
    });
    const [editingModelo, setEditingModelo] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    // Carregar modelos existentes
    useEffect(() => {
        const fetchModelos = async () => {
            try {
                const response = await axiosInstance.get("/api/preventiva/modelos-checklist/", {
                    
                });
                // Ordenar modelos em ordem decrescente por ID (mais recente primeiro)
                const modelosOrdenados = response.data.sort((a, b) => b.id - a.id);
                setModelos(modelosOrdenados);
            } catch (error) {
                console.error("Erro ao carregar modelos:", error);
                toast.error("Erro ao carregar modelos existentes");
            }
        };

        fetchModelos();
    });

    // Validação em tempo real
    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "nome":
                if (!value) error = "Nome do modelo é obrigatório";
                else if (value.length < 3) error = "Nome deve ter pelo menos 3 caracteres";
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setModelo(prev => ({ ...prev, [name]: value }));
        setFormChanged(true);
        
        // Validação em tempo real
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
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
        Object.keys(modelo).forEach(key => {
            const error = validateField(key, modelo[key]);
            if (error) finalErrors[key] = error;
        });

        if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);
            toast.error("Por favor, corrija os erros no formulário");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post("/api/preventiva/modelos-checklist/", modelo, {
                
            });
            // Adicionar novo modelo no início da lista
            setModelos(prev => [response.data, ...prev]);
            toast.success("Modelo de checklist criado com sucesso!");
            setModelo({ nome: "" });
            setFormChanged(false);
        } catch (error) {
            console.error("Erro ao criar modelo:", error.response?.data || error.message);
            toast.error("Erro ao criar modelo: " + (error.response?.data?.message || "Erro desconhecido"));
        } finally {
            setLoading(false);
        }
    };

    const handleEditStart = (modelo) => {
        setEditingModelo(modelo.id);
        setEditValue(modelo.nome);
    };

    const handleEditCancel = () => {
        setEditingModelo(null);
        setEditValue("");
    };

    const handleEditSave = async (modeloId) => {
        if (!editValue.trim()) {
            toast.error("O nome do modelo não pode estar vazio");
            return;
        }

        try {
            const response = await axiosInstance.patch(
                `/api/preventiva/modelos-checklist/${modeloId}/`,
                { nome: editValue },
            );
            
            setModelos(prev => 
                prev.map(modelo => 
                    modelo.id === modeloId 
                        ? { ...modelo, nome: editValue }
                        : modelo
                )
            );
            
            setEditingModelo(null);
            setEditValue("");
            toast.success("Modelo atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar modelo:", error);
            toast.error("Erro ao atualizar modelo");
        }
    };

    const handleManageItems = (id) => {
        navigate(`/gerenciar-itens-modelo/${id}`);
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

    // Função para filtrar os modelos
    const filteredModelos = modelos.filter(modelo => 
        modelo.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar/>
            <ToastContainer position="top-right" autoClose={5000} />

            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <span onClick={() => handleCancel()} className="cursor-pointer hover:text-blue-600">Dashboard</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Modelos de Checklist</span>
                </div>

                {/* Formulário de criação */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Novo Modelo</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiClipboard className="text-blue-600" />
                                    Dados do Modelo
                                </div>
                            </legend>
                            <div className="grid md:grid-cols-1 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome do Modelo <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="nome" 
                                        value={modelo.nome} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.nome ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        placeholder="Ex: Preventiva Anual"
                                        required 
                                    />
                                    {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
                                </div>
                            </div>
                        </fieldset>

                        <div className="flex gap-4 justify-end">
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
                                {loading ? "Criando..." : "Criar Modelo"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Lista de modelos existentes */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Modelos Existentes</h2>
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Pesquisar modelos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {filteredModelos.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                {searchTerm ? "Nenhum modelo encontrado" : "Nenhum modelo cadastrado"}
                            </p>
                        ) : (
                            filteredModelos.map(modelo => (
                                <div key={modelo.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-center">
                                        {editingModelo === modelo.id ? (
                                            <div className="flex-1 flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleEditSave(modelo.id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                    title="Confirmar Edição"
                                                >
                                                    <FiCheck size={20} />
                                                </button>
                                                <button
                                                    onClick={handleEditCancel}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Cancelar Edição"
                                                >
                                                    <FiX size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="font-medium text-gray-800">{modelo.nome}</h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleManageItems(modelo.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Visualizar Itens"
                                                    >
                                                        <FiEye size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditStart(modelo)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Editar Modelo"
                                                    >
                                                        <FiEdit2 size={20} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
