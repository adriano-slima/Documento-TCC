import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import NavBar from '../components/NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditarAnalisador = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    numero_serie: '',
    patrimonio: '',
  });

  const [parametros, setParametros] = useState([]);
  const [parametrosSelecionados, setParametrosSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    // Carregar dados do analisador
    const fetchAnalisador = async () => {
      try {
        const response = await axiosInstance.get(`/api/calibracao/analisadores/${id}/`);
        const { marca, modelo, numero_serie, patrimonio, parametros } = response.data;
        setFormData({ marca, modelo, numero_serie, patrimonio });
        
        // Verificar se parametros existe e é um array
        if (parametros && Array.isArray(parametros)) {
          // Extrair apenas os IDs dos parâmetros
          const parametrosIds = parametros.map(p => p.id);
          console.log('Parâmetros do analisador:', parametrosIds);
          setParametrosSelecionados(parametrosIds);
        } else {
          console.log('Nenhum parâmetro encontrado para este analisador');
          setParametrosSelecionados([]);
        }
      } catch (error) {
        console.error('Erro ao carregar analisador:', error);
        toast.error('Erro ao carregar dados do analisador');
        navigate('/listar-analisadores');
      }
    };

    // Carregar lista de parâmetros
    const fetchParametros = async () => {
      try {
        const response = await axiosInstance.get('/api/calibracao/parametros/');
        setParametros(response.data);
      } catch (error) {
        console.error('Erro ao carregar parâmetros:', error);
        toast.error('Erro ao carregar lista de parâmetros');
      }
    };

    fetchAnalisador();
    fetchParametros();
  }, [id, navigate]);

  // Adicionar console.log para debug
  useEffect(() => {
    console.log('Parâmetros selecionados atualizados:', parametrosSelecionados);
  }, [parametrosSelecionados]);

  const handleCheckboxChange = (id) => {
    setParametrosSelecionados(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id];
      return newSelection;
    });
    setFormChanged(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormChanged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Preparar os dados no formato esperado pelo backend
    const dados = {
      ...formData,
      parametros_ids: parametrosSelecionados // Enviar apenas os IDs dos parâmetros
    };
    
    try {
      const response = await axiosInstance.put(
        `/api/calibracao/analisadores/${id}/`,
        dados,
      );
      
      console.log('Resposta da API:', response.data);
      toast.success('Analisador atualizado com sucesso!');
      setFormChanged(false);
      navigate('/listar-analisadores');
    } catch (error) {
      console.error('Erro ao atualizar analisador:', error);
      toast.error('Erro ao atualizar analisador. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formChanged) {
      if (window.confirm("Tem certeza que deseja sair? As alterações não serão salvas.")) {
        navigate("/listar-analisadores");
      }
    } else {
      navigate("/listar-analisadores");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <span onClick={() => handleCancel()} className="cursor-pointer hover:text-blue-600">Listar Analisadores</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Editar Analisador</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Analisador</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <fieldset className="border border-gray-200 p-6 rounded-lg">
              <legend className="text-lg font-semibold text-gray-700 px-2">
                <div className="flex items-center gap-2">
                  <FiSettings className="text-blue-600" />
                  Dados do Analisador
                </div>
              </legend>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marca <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Série <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="numero_serie"
                    value={formData.numero_serie}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patrimônio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="patrimonio"
                    value={formData.patrimonio}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-gray-200 p-6 rounded-lg">
              <legend className="text-lg font-semibold text-gray-700 px-2">
                <div className="flex items-center gap-2">
                  <FiSettings className="text-blue-600" />
                  Parâmetros Compatíveis
                </div>
              </legend>
              <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto border border-gray-200">
                <div className="space-y-2">
                  {parametros.map(param => (
                    <label key={param.id} className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                      <input
                        type="checkbox"
                        checked={parametrosSelecionados.includes(param.id)}
                        onChange={() => handleCheckboxChange(param.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {param.nome} <span className="text-gray-500">({param.unidade_medida})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>

            <div className="flex gap-4 justify-end">
              <button 
                type="button" 
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
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
                {loading ? "Atualizando..." : "Atualizar Analisador"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarAnalisador; 