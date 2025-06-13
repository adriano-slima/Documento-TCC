import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import NavBar from '../components/NavBar';
import { FiClipboard, FiEdit2, FiTrash2, FiPlus, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CadastroValorModelo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [modelo, setModelo] = useState(null);
  const [valor, setValor] = useState('');
  const [valores, setValores] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingValor, setEditingValor] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modeloResponse, valoresResponse] = await Promise.all([
          axiosInstance.get(`/api/calibracao/modelos-parametro/${id}/`, 
          ),
          axiosInstance.get(`/api/calibracao/valores-modelo/?modelo=${id}`, 

          )
        ]);
        setModelo(modeloResponse.data);
        setValores(valoresResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados do modelo");
      }
    };
    fetchData();
  }, [id]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "valor":
        if (!value) error = "Valor é obrigatório";
        else if (isNaN(value)) error = "Valor deve ser um número";
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "valor") {
      setValor(value);
    }
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateField("valor", valor);
    if (error) {
      setErrors({ valor: error });
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/calibracao/valores-modelo/', {
        valor: parseFloat(valor),
        modelo: id
      },      
      );
      
      setValores(prev => [...prev, response.data]);
      setValor('');
      toast.success("Valor cadastrado com sucesso!");
    } catch (error) {
      console.error('Erro ao cadastrar valor:', error);
      toast.error("Erro ao cadastrar valor: " + (error.response?.data?.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (valorId) => {
    if (window.confirm("Tem certeza que deseja excluir este valor?")) {
      try {
        await axiosInstance.delete(`/api/calibracao/valores-modelo/${valorId}/`, 
        );
        setValores(prev => prev.filter(valor => valor.id !== valorId));
        toast.success("Valor excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir valor:", error);
        toast.error("Erro ao excluir valor");
      }
    }
  };

  const handleEdit = (valor) => {
    setEditingValor(valor.id);
    setEditValue(valor.valor);
  };

  const handleCancelEdit = () => {
    setEditingValor(null);
    setEditValue("");
  };

  const handleSaveEdit = async (valorId) => {
    if (!editValue.trim()) {
      toast.error("O valor não pode estar vazio");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/api/calibracao/valores-modelo/${valorId}/`,
        { valor: parseFloat(editValue), modelo: id },
      );
      
      setValores(prev => prev.map(valor => 
        valor.id === valorId ? response.data : valor
      ));
      setEditingValor(null);
      setEditValue("");
      toast.success("Valor atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar valor:", error);
      toast.error("Erro ao atualizar valor");
    }
  };

  const handleBack = () => {
    navigate("/cadastro-modelo-parametro");
  };

  if (!modelo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar/>
        <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar/>
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <span onClick={handleBack} className="cursor-pointer hover:text-blue-600 flex items-center gap-1">
            <FiArrowLeft size={16} />
            Modelos de Parâmetro
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Valores do Modelo - {modelo.nome_modelo}</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Modelo: {modelo.nome_modelo}</h1>
            <p className="text-gray-600 mt-2">Gerencie os valores deste modelo de parâmetro</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Adicionar Novo Valor</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <fieldset className="border border-gray-200 p-6 rounded-lg">
              <legend className="text-lg font-semibold text-gray-700 px-2">
                <div className="flex items-center gap-2">
                  <FiClipboard className="text-blue-600" />
                  Dados do Valor
                </div>
              </legend>
              <div className="grid md:grid-cols-1 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="valor"
                    value={valor}
                    onChange={handleChange}
                    step="0.0001"
                    required
                    className={`w-full p-2 border ${errors.valor ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  />
                  {errors.valor && <p className="text-red-500 text-sm mt-1">{errors.valor}</p>}
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
                {loading ? "Adicionando..." : "Adicionar Valor"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Valores Cadastrados</h2>
          
          <div className="space-y-4">
            {valores.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum valor cadastrado</p>
            ) : (
              valores.map(valor => (
                <div key={valor.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    {editingValor === valor.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          step="0.0001"
                          className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(valor.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Salvar"
                        >
                          <FiCheck size={20} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Cancelar"
                        >
                          <FiX size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium text-gray-800">{valor.valor}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(valor)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Editar Valor"
                          >
                            <FiEdit2 size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(valor.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Excluir Valor"
                          >
                            <FiTrash2 size={20} />
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

export default CadastroValorModelo;
