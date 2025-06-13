import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import NavBar from '../components/NavBar';
import { FiClipboard, FiEdit2, FiEye, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CadastroModeloParametro = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [errors, setErrors] = useState({});
  const [modelos, setModelos] = useState([]);
  const [nomeModelo, setNomeModelo] = useState('');
  const [parametros, setParametros] = useState([]);
  const [parametroSelecionado, setParametroSelecionado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [editingModelo, setEditingModelo] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [searchModeloTerm, setSearchModeloTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parametrosResponse, modelosResponse] = await Promise.all([
          axiosInstance.get('/api/calibracao/parametros/'),
          axiosInstance.get('/api/calibracao/modelos-parametro/')
        ]);
        setParametros(parametrosResponse.data);
        setModelos(modelosResponse.data.sort((a, b) => b.id - a.id));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao carregar dados");
      }
    };
    fetchData();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "nomeModelo":
        if (!value) error = "Nome do modelo é obrigatório";
        else if (value.length < 3) error = "Nome deve ter pelo menos 3 caracteres";
        break;
      case "parametroSelecionado":
        if (!value) error = "Selecione um parâmetro";
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nomeModelo") {
      setNomeModelo(value);
    }
    setFormChanged(true);
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalErrors = {};
    Object.keys({ nomeModelo, parametroSelecionado }).forEach(key => {
      const error = validateField(key, key === 'nomeModelo' ? nomeModelo : parametroSelecionado);
      if (error) finalErrors[key] = error;
    });

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/calibracao/modelos-parametro/', {
        nome_modelo: nomeModelo,
        parametro: parametroSelecionado
      }, 
      );
      
      setModelos(prev => [response.data, ...prev]);
      toast.success("Modelo criado com sucesso!");
      setNomeModelo('');
      setParametroSelecionado('');
      setSearchTerm('');
      setFormChanged(false);
    } catch (error) {
      console.error('Erro ao criar modelo:', error);
      toast.error("Erro ao criar modelo: " + (error.response?.data?.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (modelo) => {
    setEditingModelo(modelo.id);
    setEditValue(modelo.nome_modelo);
  };

  const handleEditCancel = () => {
    setEditingModelo(null);
    setEditValue("");
  };

  const handleEditSave = async (modeloId) => {
    if (!editValue.trim()) {
      toast.error("O nome do modelo não pode estar vazio");
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `/api/calibracao/modelos-parametro/${modeloId}/`,
        { nome_modelo: editValue },
        
      );
      
      setModelos(prev => 
        prev.map(modelo => 
          modelo.id === modeloId 
            ? { ...modelo, nome_modelo: editValue }
            : modelo
        )
      );
      
      setEditingModelo(null);
      setEditValue("");
      toast.success("Modelo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar modelo:", error);
      toast.error("Erro ao atualizar modelo");
    }
  };

  const handleViewValues = (id) => {
    navigate(`/cadastrar-valores/${id}`);
  };

  const handleCancel = () => {
    if (formChanged) {
      if (window.confirm("Tem certeza que deseja sair? As alterações não serão salvas.")) {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  };

  const filteredParametros = parametros.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.unidade_medida.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredModelos = modelos.filter(modelo => 
    modelo.nome_modelo.toLowerCase().includes(searchModeloTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar/>
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <span onClick={() => handleCancel()} className="cursor-pointer hover:text-blue-600">Dashboard</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Modelos de Parâmetro</span>
        </div>

        {/* Formulário de criação */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Novo Modelo</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <fieldset className="border border-gray-200 p-6 rounded-lg">
              <legend className="text-lg font-semibold text-gray-700 px-2">
                <div className="flex items-center gap-2">
                  <FiClipboard className="text-blue-600" />
                  Dados do Modelo
                </div>
              </legend>
              <div className="grid md:grid-cols-1 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Modelo <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="nomeModelo"
                    value={nomeModelo} 
                    onChange={handleChange} 
                    className={`w-full border ${errors.nomeModelo ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    placeholder="Ex: Modelo de Calibração"
                    required 
                  />
                  {errors.nomeModelo && <p className="text-red-500 text-sm mt-1">{errors.nomeModelo}</p>}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parâmetro <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Pesquisar parâmetro..."
                    value={searchTerm}
                    onFocus={() => setShowOptions(true)}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowOptions(true);
                    }}
                    className={`w-full p-2 border ${errors.parametroSelecionado ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  />
                  {showOptions && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow max-h-48 overflow-y-auto">
                      {filteredParametros.length > 0 ? (
                        filteredParametros.map(p => (
                          <div
                            key={p.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setParametroSelecionado(p.id);
                              setSearchTerm(`${p.nome} (${p.unidade_medida})`);
                              setShowOptions(false);
                            }}
                          >
                            {p.nome} ({p.unidade_medida})
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">Nenhum parâmetro encontrado</div>
                      )}
                    </div>
                  )}
                  {errors.parametroSelecionado && <p className="text-red-500 text-sm mt-1">{errors.parametroSelecionado}</p>}
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
                {loading ? "Criando..." : "Criar Modelo"}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de modelos existentes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Modelos Existentes</h2>
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Pesquisar modelos..."
                value={searchModeloTerm}
                onChange={(e) => setSearchModeloTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredModelos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {searchModeloTerm ? "Nenhum modelo encontrado" : "Nenhum modelo cadastrado"}
              </p>
            ) : (
              filteredModelos.map(modelo => (
                <div key={modelo.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    {editingModelo === modelo.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditSave(modelo.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Confirmar Edição"
                        >
                          <FiCheck size={20} />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Cancelar Edição"
                        >
                          <FiX size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-gray-800">{modelo.nome_modelo}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewValues(modelo.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Visualizar Valores"
                          >
                            <FiEye size={20} />
                          </button>
                          <button
                            onClick={() => handleEditStart(modelo)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Editar Modelo"
                          >
                            <FiEdit2 size={20} />
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
};

export default CadastroModeloParametro;
