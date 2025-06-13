import React, { useEffect, useState } from "react";
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { FiEdit2, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListarEquipamentosPorCliente = () => {
    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [equipamentos, setEquipamentos] = useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [editingEquipamento, setEditingEquipamento] = useState(null);
    const [editValues, setEditValues] = useState({});

    useEffect(() => {
        axiosInstance.get("/api/clientes/")
            .then((res) => setClientes(res.data))
            .catch((err) => console.error("Erro ao buscar clientes", err));
    }, []);

    const buscarEquipamentos = (clienteId) => {
        axiosInstance.get(`/api/equipamentos/por_cliente/?cliente_id=${clienteId}`)
            .then((res) => setEquipamentos(res.data))
            .catch((err) => console.error("Erro ao buscar equipamentos", err));
    };

    const handleInativarEquipamento = (id) => {
        if (window.confirm("Tem certeza que deseja inativar este equipamento?")) {
            axiosInstance.patch(`/api/equipamentos/${id}/inativar/`)
                .then(() => {
                    toast.success("Equipamento inativado com sucesso!");
                    buscarEquipamentos(clienteSelecionado.id);
                })
                .catch((err) => {
                    console.error("Erro ao inativar equipamento", err);
                    toast.error("Erro ao inativar equipamento");
                });
        }
    };

    const handleStatusChange = async (equipamentoId, novoStatus) => {
        try {
            const response = await axiosInstance.patch(
                `/api/equipamentos/${equipamentoId}/`,
                { status: novoStatus }
            );
            
            setEquipamentos(prev => 
                prev.map(equip => 
                    equip.id === equipamentoId 
                        ? { ...equip, status: novoStatus }
                        : equip
                )
            );
            
            toast.success("Status do equipamento atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            toast.error("Erro ao atualizar status do equipamento");
        }
    };

    const filteredClientes = clientes.filter(cliente =>
        cliente.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cnpj_cpf.includes(searchTerm)
    );
   
    const handleClienteSelect = (id) => {
        const cliente = clientes.find(c => c.id === parseInt(id));
        setClienteSelecionado(cliente);
        buscarEquipamentos(id);
        setShowOptions(false);
    };

    const handleEditStart = (equipamento) => {
        setEditingEquipamento(equipamento.id);
        setEditValues({
            tipo: equipamento.tipo,
            marca: equipamento.marca,
            modelo: equipamento.modelo,
            numero_serie: equipamento.numero_serie,
            patrimonio: equipamento.patrimonio
        });
    };

    const handleEditCancel = () => {
        setEditingEquipamento(null);
        setEditValues({});
    };

    const handleEditSave = async (equipamentoId) => {
        try {
            const response = await axiosInstance.patch(
                `/api/equipamentos/${equipamentoId}/`,
                editValues
            );
            
            setEquipamentos(prev => 
                prev.map(equip => 
                    equip.id === equipamentoId 
                        ? { ...equip, ...editValues }
                        : equip
                )
            );
            
            setEditingEquipamento(null);
            setEditValues({});
            toast.success("Equipamento atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar equipamento:", error);
            toast.error("Erro ao atualizar equipamento");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar/>
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <span className="text-gray-900">Equipamentos por Cliente</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div className="relative w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Selecionar Cliente</label>
                            <input
                                type="text"
                                placeholder="Digite o nome ou CNPJ do cliente"
                                value={searchTerm}
                                onFocus={() => setShowOptions(true)}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowOptions(true);
                                }}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            {showOptions && (
                                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {filteredClientes.length > 0 ? (
                                        filteredClientes.map(cliente => (
                                            <div
                                                key={cliente.id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleClienteSelect(cliente.id)}
                                            >
                                                {cliente.nome_fantasia} - {cliente.cnpj_cpf}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-500">Nenhum cliente encontrado</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <Link 
                            to="/cadastro-equipamentos" 
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors h-10 mt-6"
                        >
                            + Novo Equipamento
                        </Link>
                    </div>
                </div>

                {clienteSelecionado && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Equipamentos de {clienteSelecionado.nome_fantasia}
                        </h3>
                        
                        {equipamentos.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                Nenhum equipamento encontrado para este cliente.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Série</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patrimônio</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {equipamentos.map((equip) => (
                                            <tr key={equip.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingEquipamento === equip.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.tipo}
                                                            onChange={(e) => setEditValues({...editValues, tipo: e.target.value})}
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                        />
                                                    ) : (
                                                        equip.tipo
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingEquipamento === equip.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.marca}
                                                            onChange={(e) => setEditValues({...editValues, marca: e.target.value})}
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                        />
                                                    ) : (
                                                        equip.marca
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingEquipamento === equip.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.modelo}
                                                            onChange={(e) => setEditValues({...editValues, modelo: e.target.value})}
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                        />
                                                    ) : (
                                                        equip.modelo
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingEquipamento === equip.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.numero_serie}
                                                            onChange={(e) => setEditValues({...editValues, numero_serie: e.target.value})}
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                        />
                                                    ) : (
                                                        equip.numero_serie
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingEquipamento === equip.id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.patrimonio}
                                                            onChange={(e) => setEditValues({...editValues, patrimonio: e.target.value})}
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                        />
                                                    ) : (
                                                        equip.patrimonio
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingEquipamento === equip.id ? (
                                                        <select
                                                            value={editValues.status || equip.status}
                                                            onChange={(e) => setEditValues({...editValues, status: e.target.value})}
                                                            className="w-full p-1 border border-gray-300 rounded"
                                                        >
                                                            <option value="Ativo">Ativo</option>
                                                            <option value="Inativo">Inativo</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            equip.status === 'Ativo' 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {equip.status}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {editingEquipamento === equip.id ? (
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleEditSave(equip.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <FiCheck size={20} />
                                                            </button>
                                                            <button
                                                                onClick={handleEditCancel}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <FiX size={20} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEditStart(equip)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <FiEdit2 size={20} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListarEquipamentosPorCliente;
