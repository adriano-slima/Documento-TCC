import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import NavBar from "../components/NavBar";
import { FiBriefcase, FiPhone, FiMapPin, FiEdit2, FiArrowLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VisualizarCliente() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const response = await axiosInstance.get(`/api/clientes/${id}/`, {
                });
                setCliente(response.data);
            } catch (error) {
                console.error("Erro ao buscar cliente:", error);
                toast.error("Erro ao carregar dados do cliente");
                navigate("/listar-clientes");
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [id, navigate]);

    const handleEdit = () => {
        navigate(`/editar-cliente/${id}`);
    };

    const handleBack = () => {
        navigate("/listar-clientes");
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

    if (!cliente) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <ToastContainer position="top-right" autoClose={5000} />

            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <span onClick={handleBack} className="cursor-pointer hover:text-blue-600">Dashboard</span>
                    <span className="mx-2">/</span>
                    <span onClick={handleBack} className="cursor-pointer hover:text-blue-600">Clientes</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Visualizar Cliente</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Visualizar Cliente</h2>
                        <button
                            onClick={handleEdit}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center gap-2"
                        >
                            <FiEdit2 size={20} />
                            Editar Cliente
                        </button>
                    </div>

                    <div className="space-y-8">
                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiBriefcase className="text-blue-600" />
                                    Dados do Cliente
                                </div>
                            </legend>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Nome Fantasia</label>
                                    <div className="text-gray-900 font-medium">{cliente.nome_fantasia}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Razão Social</label>
                                    <div className="text-gray-900 font-medium">{cliente.razao_social}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Tipo de Cliente</label>
                                    <div className="text-gray-900 font-medium">{cliente.tipo_cliente}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">CNPJ/CPF</label>
                                    <div className="text-gray-900 font-medium">{cliente.cnpj_cpf}</div>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiPhone className="text-blue-600" />
                                    Contato
                                </div>
                            </legend>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
                                    <div className="text-gray-900 font-medium">{cliente.telefone}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Telefone 2</label>
                                    <div className="text-gray-900 font-medium">{cliente.telefone2 || "-"}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                    <div className="text-gray-900 font-medium">{cliente.email}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Nome do Contato</label>
                                    <div className="text-gray-900 font-medium">{cliente.nome_contato}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Cargo</label>
                                    <div className="text-gray-900 font-medium">{cliente.cargo}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Setor</label>
                                    <div className="text-gray-900 font-medium">{cliente.setor}</div>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiMapPin className="text-blue-600" />
                                    Endereço
                                </div>
                            </legend>
                            <div className="grid md:grid-cols-3 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">CEP</label>
                                    <div className="text-gray-900 font-medium">{cliente.cep}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">UF</label>
                                    <div className="text-gray-900 font-medium">{cliente.uf}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Cidade</label>
                                    <div className="text-gray-900 font-medium">{cliente.cidade}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Endereço</label>
                                    <div className="text-gray-900 font-medium">{cliente.endereco}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Número</label>
                                    <div className="text-gray-900 font-medium">{cliente.numero}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Complemento</label>
                                    <div className="text-gray-900 font-medium">{cliente.complemento || "-"}</div>
                                </div>
                            </div>
                        </fieldset>

                        <div className="flex gap-4 justify-end">
                            <button 
                                onClick={handleBack}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <FiArrowLeft size={20} />
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 