import React, { useState, useEffect } from "react";
import axios from "axios";

function SelecionarClientes({ onClienteSelecionado }) {
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/clientes/")
            .then(response => setClientes(response.data))
            .catch(error => console.error("Erro ao buscar clientes:", error));
    }, []);

    const handleClienteSelect = (clienteId, nome) => {
        onClienteSelecionado(clienteId);
        setSearchTerm(nome);
        setShowOptions(false);
    };

    const filteredClientes = clientes.filter(cliente =>
        cliente.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cnpj_cpf.includes(searchTerm)
    );

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Selecionar Cliente (proprietário)</label>
            <input
                type="text"
                placeholder="Digite o nome ou CNPJ do cliente"
                value={searchTerm}
                onFocus={() => setShowOptions(true)}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowOptions(true);
                }}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
            {showOptions && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto">
                    {filteredClientes.length > 0 ? (
                        filteredClientes.map(cliente => (
                            <div
                                key={cliente.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleClienteSelect(cliente.id, `${cliente.nome_fantasia} - ${cliente.cnpj_cpf}`)}
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
    );
}
export default SelecionarClientes