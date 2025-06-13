import React, { useState } from "react";

function SelecionarEquipamentos({ clienteId, equipamentos, onEquipamentoSelecionado }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [,setSelectedEquipamento] = useState(null);

    const handleSelect = (equipamento) => {
        setSelectedEquipamento(equipamento);
        setShowOptions(false);
        setSearchTerm(`${equipamento.tipo} - ${equipamento.marca} - ${equipamento.modelo} - ${equipamento.numero_serie}`);
        onEquipamentoSelecionado(equipamento.id); // Callback para o componente pai
    };

    const filteredEquipamentos = equipamentos.filter((equipamento) =>
        `${equipamento.tipo} ${equipamento.marca} ${equipamento.modelo} ${equipamento.numero_serie}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mb-4">
            <label htmlFor="equipamento" className="block font-medium mb-1">
                Equipamento
            </label>
            <input
                type="text"
                id="equipamento"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowOptions(true);
                }}
                onFocus={() => setShowOptions(true)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Pesquise por tipo, marca, modelo e número se série"
            />
            {showOptions && (
                <ul className="border border-gray-300 rounded max-h-48 overflow-y-auto mt-1 bg-white z-10 relative">
                    {filteredEquipamentos.map((equipamento) => (
                        <li
                            key={equipamento.id}
                            onClick={() => handleSelect(equipamento)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {equipamento.tipo} - {equipamento.marca} - {equipamento.modelo} - {equipamento.numero_serie}
                        </li>
                    ))}
                    {filteredEquipamentos.length === 0 && (
                        <li className="px-3 py-2 text-gray-500">Nenhum equipamento encontrado</li>
                    )}
                </ul>
            )}
        </div>
    );
}

export default SelecionarEquipamentos;