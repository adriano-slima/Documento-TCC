import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import NavBar from "../components/NavBar";
import { FiEdit2, FiPlus, FiSave, FiX, FiInfo, FiSettings, FiFileText } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VisualizarAnalisador = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [analisador, setAnalisador] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCertificado, setEditingCertificado] = useState(null);
    const [novoCertificado, setNovoCertificado] = useState({
        numero_certificado: "",
        data_calibracao: "",
        data_validade: "",
        calibrado_por: ""
    });

    useEffect(() => {
        carregarAnalisador();
    }, [id]);

    const carregarAnalisador = async () => {
        try {
            const response = await axiosInstance.get(`/api/calibracao/analisadores/${id}/`, {
                
            });
            setAnalisador(response.data);
            setLoading(false);
        } catch (err) {
            setError("Erro ao carregar dados do analisador");
            setLoading(false);
            console.error("Erro:", err);
        }
    };

    const handleEditCertificado = (certificado) => {
        setEditingCertificado(certificado);
    };

    const handleSaveCertificado = async (certificado) => {
        try {
            await axiosInstance.put(`/api/calibracao/certificados/${certificado.id}/`, certificado, {
                
            });
            setEditingCertificado(null);
            carregarAnalisador();
            toast.success("Certificado atualizado com sucesso!");
        } catch (err) {
            console.error("Erro ao atualizar certificado:", err);
            toast.error("Erro ao atualizar certificado");
        }
    };

    const handleCreateCertificado = async () => {
        try {
            await axiosInstance.post("/api/calibracao/certificados/", {
                ...novoCertificado,
                analisador: id
            }, {
                
            });
            setNovoCertificado({
                numero_certificado: "",
                data_calibracao: "",
                data_validade: "",
                calibrado_por: ""
            });
            carregarAnalisador();
            toast.success("Certificado criado com sucesso!");
        } catch (err) {
            console.error("Erro ao criar certificado:", err);
            toast.error("Erro ao criar certificado");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <NavBar />
                <div className="pt-16 px-6 ml-0 md:ml-64 mt-4">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <p>Carregando...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !analisador) {
        return (
            <div className="min-h-screen bg-gray-100">
                <NavBar />
                <div className="pt-16 px-6 ml-0 md:ml-64 mt-4">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-red-500">{error || "Analisador não encontrado"}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <ToastContainer position="top-right" autoClose={5000} />

            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <span onClick={() => navigate("/listar-analisadores")} className="cursor-pointer hover:text-blue-600">
                        Analisadores
                    </span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Visualizar Analisador</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Detalhes do Analisador</h2>
                        <button
                            onClick={() => navigate(`/editar-analisador/${id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Editar Analisador
                        </button>
                    </div>

                    {/* Informações Básicas */}
                    <fieldset className="border border-gray-200 p-6 rounded-lg mb-6">
                        <legend className="text-lg font-semibold text-gray-700 px-2">
                            <div className="flex items-center gap-2">
                                <FiInfo className="text-blue-600" />
                                Informações Básicas
                            </div>
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                                <p className="font-medium text-gray-800">{analisador.marca}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                                <p className="font-medium text-gray-800">{analisador.modelo}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Série</label>
                                <p className="font-medium text-gray-800">{analisador.numero_serie}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patrimônio</label>
                                <p className="font-medium text-gray-800">{analisador.patrimonio}</p>
                            </div>
                        </div>
                    </fieldset>

                    {/* Parâmetros Compatíveis */}
                    <fieldset className="border border-gray-200 p-6 rounded-lg mb-6">
                        <legend className="text-lg font-semibold text-gray-700 px-2">
                            <div className="flex items-center gap-2">
                                <FiSettings className="text-blue-600" />
                                Parâmetros Compatíveis
                            </div>
                        </legend>
                        {analisador.parametros && analisador.parametros.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
                                {analisador.parametros.map(parametro => (
                                    <div key={parametro.id} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-1/3">
                                                <label className="text-sm font-medium text-gray-700">Nome do Parâmetro:</label>
                                            </div>
                                            <div className="w-2/3">
                                                <p className="font-medium text-gray-800">{parametro.nome}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 mt-4">
                                            <div className="w-1/3">
                                                <label className="text-sm font-medium text-gray-700">Unidade de Medida:</label>
                                            </div>
                                            <div className="w-2/3">
                                                <p className="font-medium text-gray-800">{parametro.unidade_medida}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 mt-4">Nenhum parâmetro compatível cadastrado</p>
                        )}
                    </fieldset>

                    {/* Certificados */}
                    <fieldset className="border border-gray-200 p-6 rounded-lg">
                        <legend className="text-lg font-semibold text-gray-700 px-2">
                            <div className="flex items-center gap-2">
                                <FiFileText className="text-blue-600" />
                                Certificados
                            </div>
                        </legend>
                        
                        {/* Formulário de Novo Certificado */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número do Certificado</label>
                                    <input
                                        type="text"
                                        value={novoCertificado.numero_certificado}
                                        onChange={(e) => setNovoCertificado({ ...novoCertificado, numero_certificado: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Calibração</label>
                                    <input
                                        type="date"
                                        value={novoCertificado.data_calibracao}
                                        onChange={(e) => setNovoCertificado({ ...novoCertificado, data_calibracao: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
                                    <input
                                        type="date"
                                        value={novoCertificado.data_validade}
                                        onChange={(e) => setNovoCertificado({ ...novoCertificado, data_validade: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Calibrado por</label>
                                    <input
                                        type="text"
                                        value={novoCertificado.calibrado_por}
                                        onChange={(e) => setNovoCertificado({ ...novoCertificado, calibrado_por: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleCreateCertificado}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                                >
                                    <FiPlus /> Cadastrar Certificado
                                </button>
                            </div>
                        </div>

                        {/* Tabela de Certificados */}
                        {analisador.certificados && analisador.certificados.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número do Certificado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Calibração</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Validade</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calibrado por</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {analisador.certificados.map(certificado => (
                                            <tr key={certificado.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingCertificado?.id === certificado.id ? (
                                                        <input
                                                            type="text"
                                                            value={editingCertificado.numero_certificado}
                                                            onChange={(e) => setEditingCertificado({ ...editingCertificado, numero_certificado: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                        />
                                                    ) : (
                                                        certificado.numero_certificado
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingCertificado?.id === certificado.id ? (
                                                        <input
                                                            type="date"
                                                            value={editingCertificado.data_calibracao}
                                                            onChange={(e) => setEditingCertificado({ ...editingCertificado, data_calibracao: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                        />
                                                    ) : (
                                                        new Date(certificado.data_calibracao).toLocaleDateString()
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingCertificado?.id === certificado.id ? (
                                                        <input
                                                            type="date"
                                                            value={editingCertificado.data_validade}
                                                            onChange={(e) => setEditingCertificado({ ...editingCertificado, data_validade: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                        />
                                                    ) : (
                                                        new Date(certificado.data_validade).toLocaleDateString()
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingCertificado?.id === certificado.id ? (
                                                        <input
                                                            type="text"
                                                            value={editingCertificado.calibrado_por}
                                                            onChange={(e) => setEditingCertificado({ ...editingCertificado, calibrado_por: e.target.value })}
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                        />
                                                    ) : (
                                                        certificado.calibrado_por
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {editingCertificado?.id === certificado.id ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleSaveCertificado(editingCertificado)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <FiSave size={20} />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingCertificado(null)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <FiX size={20} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEditCertificado(certificado)}
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
                        ) : (
                            <p className="text-gray-500 mt-4">Nenhum certificado cadastrado</p>
                        )}
                    </fieldset>
                </div>
            </div>
        </div>
    );
};

export default VisualizarAnalisador; 