import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import NavBar from "../components/NavBar";
import { FiClipboard, FiEdit2, FiTrash2, FiPlus, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function GerenciarItensModelo() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [modelo, setModelo] = useState(null);
    const [itens, setItens] = useState([]);
    const [novoItem, setNovoItem] = useState({
        nome_item: ""
    });
    const [errors, setErrors] = useState({});
    const [editingItem, setEditingItem] = useState(null);
    const [editValue, setEditValue] = useState("");

    // Carregar modelo e itens
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [modeloResponse, itensResponse] = await Promise.all([
                    axiosInstance.get(`/api/preventiva/modelos-checklist/${id}/`, {
                        
                    }),
                    axiosInstance.get(`/api/preventiva/itens-modelo-checklist/?modelo=${id}`, {
                        
                    })
                ]);
                setModelo(modeloResponse.data);
                setItens(itensResponse.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                toast.error("Erro ao carregar dados do modelo");
            }
        };

        fetchData();
    }, [id]);

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "nome_item":
                if (!value) error = "Nome do item é obrigatório";
                else if (value.length < 3) error = "Nome deve ter pelo menos 3 caracteres";
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovoItem(prev => ({ ...prev, [name]: value }));
        
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const error = validateField("nome_item", novoItem.nome_item);
        if (error) {
            setErrors({ nome_item: error });
            toast.error("Por favor, corrija os erros no formulário");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post("/api/preventiva/itens-modelo-checklist/", 
                { ...novoItem, modelo: id },
                
            );
            setItens(prev => [...prev, response.data]);
            setNovoItem({ nome_item: "" });
            toast.success("Item adicionado com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar item:", error);
            toast.error("Erro ao adicionar item");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm("Tem certeza que deseja excluir este item?")) {
            try {
                await axiosInstance.delete(`/api/preventiva/itens-modelo-checklist/${itemId}/`);
                setItens(prev => prev.filter(item => item.id !== itemId));
                toast.success("Item excluído com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir item:", error);
                toast.error("Erro ao excluir item");
            }
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item.id);
        setEditValue(item.nome_item);
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditValue("");
    };

    const handleSaveEdit = async (itemId) => {
        if (!editValue.trim()) {
            toast.error("O nome do item não pode estar vazio");
            return;
        }

        try {
            const response = await axiosInstance.put(
                `/api/preventiva/itens-modelo-checklist/${itemId}/`,
                { nome_item: editValue, modelo: id },
                
            );
            
            setItens(prev => prev.map(item => 
                item.id === itemId ? response.data : item
            ));
            setEditingItem(null);
            setEditValue("");
            toast.success("Item atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar item:", error);
            toast.error("Erro ao atualizar item");
        }
    };

    const handleBack = () => {
        navigate("/criar-modelo-preventiva");
    };

    if (!modelo) {
        return (
            <div className="min-h-screen bg-gray-50">
                <NavBar/>
                <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500">Carregando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar/>
            <ToastContainer position="top-right" autoClose={5000} />

            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <span onClick={handleBack} className="cursor-pointer hover:text-blue-600 flex items-center gap-1">
                        <FiArrowLeft size={16} />
                        Modelos de Checklist
                    </span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Gerenciar Itens - {modelo.nome}</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Modelo: {modelo.nome}</h1>
                        <p className="text-gray-600 mt-2">Gerencie os itens deste modelo de checklist</p>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Adicionar Novo Item</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiClipboard className="text-blue-600" />
                                    Dados do Item
                                </div>
                            </legend>
                            <div className="grid md:grid-cols-1 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome do Item <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="nome_item" 
                                        value={novoItem.nome_item} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.nome_item ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        placeholder="Ex: Verificar temperatura ambiente"
                                        required 
                                    />
                                    {errors.nome_item && <p className="text-red-500 text-sm mt-1">{errors.nome_item}</p>}
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
                                {loading ? "Adicionando..." : "Adicionar Item"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Itens do Modelo</h2>
                    
                    <div className="space-y-4">
                        {itens.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Nenhum item cadastrado</p>
                        ) : (
                            itens.map(item => (
                                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-center">
                                        {editingItem === item.id ? (
                                            <div className="flex-1 flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleSaveEdit(item.id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                    title="Salvar"
                                                >
                                                    <FiCheck size={20} />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Cancelar"
                                                >
                                                    <FiX size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="font-medium text-gray-800">{item.nome_item}</h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Editar Item"
                                                    >
                                                        <FiEdit2 size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Excluir Item"
                                                    >
                                                        <FiTrash2 size={20} />
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