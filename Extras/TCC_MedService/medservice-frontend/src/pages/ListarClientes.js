import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import NavBar from "../components/NavBar";
import { FiEdit2, FiEye, FiX, FiSearch, FiUserPlus } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListarClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [busca, setBusca] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        axiosInstance.get("/api/clientes/", {
            
        })
            .then(res => setClientes(res.data))
            .catch(err => {
                console.error("Erro ao buscar clientes:", err);
                toast.error("Erro ao carregar clientes");
            });
    }, []);

    const carregarClientes = () => {
        axiosInstance.get("/api/clientes/", {
            
        })
            .then(response => setClientes(response.data))
            .catch(error => {
                console.error("Erro ao buscar clientes:", error);
                toast.error("Erro ao recarregar clientes");
            });
    };

    const confirmarInativacao = (id) => {
        if (window.confirm("Tem certeza que deseja inativar este cliente?")) {
            axiosInstance.patch(`/api/clientes/${id}/inativar/`, {}, {  
            })
                .then(() => {
                    toast.success("Cliente inativado com sucesso!");
                    carregarClientes();
                })
                .catch(error => {
                    console.error("Erro ao inativar cliente:", error);
                    toast.error("Erro ao inativar cliente");
                });
        }
    };

    const clientesFiltrados = clientes.filter(c =>
        c.nome_fantasia.toLowerCase().includes(busca.toLowerCase()) ||
        c.cnpj_cpf.includes(busca)
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <ToastContainer position="top-right" autoClose={5000} />

            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <span onClick={() => navigate("/dashboard")} className="cursor-pointer hover:text-blue-600">Dashboard</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Clientes</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Lista de Clientes</h2>
                        <Link 
                            to="/cadastro-clientes" 
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center gap-2"
                        >
                            <FiUserPlus size={20} />
                            Novo Cliente
                        </Link>
                    </div>

                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Pesquisar por nome ou CNPJ..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Fantasia</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ/CPF</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {clientesFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            {busca ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
                                        </td>
                                    </tr>
                                ) : (
                                    clientesFiltrados.map(cliente => (
                                        <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{cliente.nome_fantasia}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{cliente.cnpj_cpf}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    cliente.status === "Ativo" 
                                                        ? "bg-green-100 text-green-800" 
                                                        : "bg-red-100 text-red-800"
                                                }`}>
                                                    {cliente.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/visualizar-cliente/${cliente.id}`)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Visualizar Cliente"
                                                    >
                                                        <FiEye size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/editar-cliente/${cliente.id}`)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Editar Cliente"
                                                    >
                                                        <FiEdit2 size={20} />
                                                    </button>
                                                    {cliente.status === "Ativo" && (
                                                        <button
                                                            onClick={() => confirmarInativacao(cliente.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                            title="Inativar Cliente"
                                                        >
                                                            <FiX size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListarClientes;