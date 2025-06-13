import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelecionarAnalisador({ onAnalisadorSelecionado }) {
    const [analisadores, setAnalisadores] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/calibracao/analisadores/")
            .then(response => setAnalisadores(response.data))
            .catch(error => console.error("Erro ao buscar analisadores:", error));
    }, []);

    const handleSelect = (analisadorId, displayText) => {
        onAnalisadorSelecionado(analisadorId);
        setSearchTerm(displayText);
        setShowOptions(false);
    };

    const filtered = analisadores.filter(item =>
        item.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.patrimonio.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Selecionar Analisador</label>
            <input
                type="text"
                placeholder="Digite a marca, modelo ou patrimônio"
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
                    {filtered.length > 0 ? (
                        filtered.map(analisador => (
                            <div
                                key={analisador.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(analisador.id, `${analisador.marca} ${analisador.modelo} - ${analisador.patrimonio}`)}
                            >
                                {analisador.marca} {analisador.modelo} - Patrimônio: {analisador.patrimonio}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500">Nenhum analisador encontrado</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SelecionarAnalisador;
