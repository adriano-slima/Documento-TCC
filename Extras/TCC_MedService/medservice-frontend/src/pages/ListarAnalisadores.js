import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import NavBar from "../components/NavBar";
import { FiEdit2, FiEye } from 'react-icons/fi';

const ListarAnalisadores = () => {
    const [analisadores, setAnalisadores] = useState([]);
    const [busca, setBusca] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get("/api/calibracao/analisadores/", {   
        })
            .then(res => setAnalisadores(res.data))
            .catch(err => console.error("Erro ao buscar analisadores:", err));
    }, []);

    const carregarAnalisadores = () => {
        axiosInstance.get("/api/calibracao/analisadores/", {
        })
            .then(response => setAnalisadores(response.data))
            .catch(error => console.error("Erro ao buscar analisadores:", error));
    };

    const analisadoresFiltrados = analisadores.filter(a =>
        a.marca.toLowerCase().includes(busca.toLowerCase()) ||
        a.modelo.toLowerCase().includes(busca.toLowerCase()) ||
        a.patrimonio.includes(busca)
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />

            {/* Conteúdo principal */}
            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all">
                {/* Conteúdo */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Analisadores</h2>
                    
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative max-w-md flex-1">
                            <input
                                type="text"
                                placeholder="Buscar por marca, modelo ou patrimônio..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <Link to="/cadastrar-analisadores" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors ml-4">
                            + Novo Analisador
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {analisadoresFiltrados.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                {busca ? "Nenhum analisador encontrado" : "Nenhum analisador cadastrado"}
                            </p>
                        ) : (
                            analisadoresFiltrados.map(analisador => (
                                <div key={analisador.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div className="grid grid-cols-4 gap-4 flex-1">
                                            <div>
                                                <p className="text-sm text-gray-500">Marca</p>
                                                <p className="font-medium text-gray-800">{analisador.marca}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Modelo</p>
                                                <p className="font-medium text-gray-800">{analisador.modelo}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Patrimônio</p>
                                                <p className="font-medium text-gray-800">{analisador.patrimonio}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Número de Série</p>
                                                <p className="font-medium text-gray-800">{analisador.numero_serie}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/visualizar-analisador/${analisador.id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <FiEye size={20} />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/editar-analisador/${analisador.id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <FiEdit2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListarAnalisadores;
