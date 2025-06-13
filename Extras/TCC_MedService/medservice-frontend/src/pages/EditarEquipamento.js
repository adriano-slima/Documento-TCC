import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import NavBar from "../components/NavBar";
import BotaoSalvarAlteracoes from "../components/BotaoSalvarAlteracoes";

const EditarEquipamento = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipamento, setEquipamento] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [filtroCliente, setFiltroCliente] = useState("");

    useEffect(() => {
        axiosInstance.get(`/api/equipamentos/${id}/`)
            .then(res => setEquipamento(res.data))
            .catch(err => console.error("Erro ao carregar equipamento", err));

        axiosInstance.get("/api/clientes/")
            .then(res => setClientes(res.data))
            .catch(err => console.error("Erro ao buscar clientes", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEquipamento(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/api/equipamentos/${id}/`, equipamento);
            alert("Equipamento atualizado com sucesso!");
            navigate("/equipamentos-por-cliente");
        } catch (err) {
            console.error("Erro ao atualizar equipamento", err);
            alert("Erro ao atualizar equipamento.");
        }
    };

    const clientesFiltrados = clientes.filter(
        (c) =>
            c.nome_fantasia.toLowerCase().includes(filtroCliente.toLowerCase()) ||
            c.cnpj_cpf.includes(filtroCliente)
    );

    if (!equipamento) return <p>Carregando...</p>;

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all">
                <h2 className="text-2xl font-semibold mb-6">Editar Equipamento</h2>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block mb-1 font-medium">Tipo de Equipamento</label>
                        <input type="text" name="tipo" value={equipamento.tipo} onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded" />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Marca</label>
                        <input type="text" name="marca" value={equipamento.marca} onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded" />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Modelo</label>
                        <input type="text" name="modelo" value={equipamento.modelo} onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded" />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Número de Série</label>
                        <input type="text" name="numero_serie" value={equipamento.numero_serie} onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded" />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Patrimônio</label>
                        <input type="text" name="patrimonio" value={equipamento.patrimonio} onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 font-medium">Pesquisar cliente por nome ou CNPJ</label>
                        <input
                            type="text"
                            placeholder="Digite para filtrar clientes"
                            className="w-full border border-gray-300 px-4 py-2 rounded"
                            value={filtroCliente}
                            onChange={(e) => setFiltroCliente(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 font-medium">Proprietário</label>
                        <select name="proprietario" value={equipamento.proprietario} onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded">
                            <option value="">Selecione o cliente</option>
                            {clientesFiltrados.map(cliente => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nome_fantasia} - {cliente.cnpj_cpf}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 font-medium">Status</label>
                        <select name="status" value={equipamento.status} onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded">
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                    </div>
                </form>
                <div className="col-span-1 md:col-span-2 mt-4">
                        <BotaoSalvarAlteracoes />
                </div>
            </div>
        </div>
    );
};

export default EditarEquipamento;
