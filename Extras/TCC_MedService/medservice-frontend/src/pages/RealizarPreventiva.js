import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import axiosInstance from "../api/axiosInstance";
import { FiCalendar, FiThermometer, FiDroplet, FiUser, FiCheckCircle, FiXCircle, FiBriefcase } from "react-icons/fi";

const RealizarPreventiva = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cabecalho, setCabecalho] = useState({
    data_execucao: "",
    data_emissao: "",
    data_validade: "",
    temp_ambiente: "",
    umidade_relativa: "",
    executante: "",
    responsavel: "",
    status: "Aberto",
    ordem_servico: id,
  });

  const [dadosOS, setDadosOS] = useState(null);
  const [laudoExistente, setLaudoExistente] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [modelosChecklist, setModelosChecklist] = useState([]);
  const [modeloSelecionado, setModeloSelecionado] = useState("");
  const [itensModelo, setItensModelo] = useState([]);
  const [itensVerificados, setItensVerificados] = useState([]);
  const [cabecalhoSalvo, setCabecalhoSalvo] = useState(false);
  const [consideracoesFinais, setConsideracoesFinais] = useState("");

  useEffect(() => {
    // Carrega dados da OS
    axiosInstance.get(`/api/ordens/${id}/`).then(res => {
      setDadosOS(res.data);
    });

    // Carrega modelos de checklist
    axiosInstance.get("/api/preventiva/modelos-checklist/").then(res => {
      setModelosChecklist(res.data);
    });

    // Verifica se já existe um laudo para esta OS
    axiosInstance.get(`/api/preventiva/cab-preventivas/por_ordem_servico/?ordem_servico_id=${id}`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          const laudo = res.data[0];
          setLaudoExistente(laudo);
          setCabecalho({
            data_execucao: laudo.data_execucao,
            data_emissao: laudo.data_emissao,
            data_validade: laudo.data_validade,
            temp_ambiente: laudo.temp_ambiente,
            umidade_relativa: laudo.umidade_relativa,
            executante: laudo.executante,
            responsavel: laudo.responsavel,
            status: laudo.status,
            ordem_servico: id
          });
          setConsideracoesFinais(laudo.consideracoes_finais || "");
          setCabecalhoSalvo(true);
          
          // Se houver modelo selecionado, carrega os itens
          if (laudo.modelo_checklist) {
            setModeloSelecionado(laudo.modelo_checklist);
            carregarItensModelo(laudo.modelo_checklist);
          }
          
          // Carrega itens verificados
          carregarItensVerificados(laudo.id);
        } else {
          setLaudoExistente(null);
          setCabecalho({
            data_execucao: "",
            data_emissao: "",
            data_validade: "",
            temp_ambiente: "",
            umidade_relativa: "",
            executante: "",
            responsavel: "",
            status: "Aberto",
            ordem_servico: id
          });
          setConsideracoesFinais("");
          setCabecalhoSalvo(false);
        }
      })
      .catch(err => {
        console.error("Erro ao buscar laudo:", err);
        setLaudoExistente(null);
        setCabecalho({
          data_execucao: "",
          data_emissao: "",
          data_validade: "",
          temp_ambiente: "",
          umidade_relativa: "",
          executante: "",
          responsavel: "",
          status: "Aberto",
          ordem_servico: id
        });
        setConsideracoesFinais("");
        setCabecalhoSalvo(false);
      });
  }, [id]);

  const carregarItensModelo = async (modeloId) => {
    try {
      const response = await axiosInstance.get(`/api/preventiva/itens-modelo-checklist/?modelo=${modeloId}`);
      setItensModelo(response.data);
    } catch (error) {
      console.error("Erro ao carregar itens do modelo:", error);
      setMensagem("Erro ao carregar itens do modelo.");
    }
  };

  const carregarItensVerificados = async (laudoId) => {
    try {
      const response = await axiosInstance.get(`/api/preventiva/itens-verificados/?cab_preventiva=${laudoId}`);
      setItensVerificados(response.data);
    } catch (error) {
      console.error("Erro ao carregar itens verificados:", error);
      setMensagem("Erro ao carregar itens verificados.");
    }
  };

  const handleChange = (e) => {
    setCabecalho({ ...cabecalho, [e.target.name]: e.target.value });
  };

  const handleSalvarCabecalho = async () => {
    try {
      if (laudoExistente && laudoExistente.id) {
        await axiosInstance.put(
          `/api/preventiva/cab-preventivas/${laudoExistente.id}/`,
          cabecalho
        );
        setMensagem("Cabeçalho atualizado com sucesso!");
      } else {
        const res = await axiosInstance.post("/api/preventiva/cab-preventivas/", cabecalho);
        setLaudoExistente(res.data);
        setCabecalhoSalvo(true);
        setMensagem("Novo laudo criado com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao salvar cabeçalho:", err);
      setMensagem("Erro ao salvar o cabeçalho.");
    }
  };

  const handleSalvarModelo = async () => {
    if (!laudoExistente?.id || !modeloSelecionado) {
      setMensagem("Selecione um modelo de checklist.");
      return;
    }

    try {
      await axiosInstance.put(
        `/api/preventiva/cab-preventivas/${laudoExistente.id}/`,
        { ...cabecalho, modelo_checklist: modeloSelecionado }
      );
      setMensagem("Modelo de checklist salvo com sucesso!");
      carregarItensModelo(modeloSelecionado);
    } catch (error) {
      console.error("Erro ao salvar modelo:", error);
      setMensagem("Erro ao salvar modelo de checklist.");
    }
  };

  const handleStatusItem = async (itemId, status) => {
    try {
      const itemVerificado = itensVerificados.find(iv => iv.item_modelo === itemId);
      
      if (itemVerificado) {
        // Atualiza item existente
        const response = await axiosInstance.put(
          `/api/preventiva/itens-verificados/${itemVerificado.id}/`,
          { ...itemVerificado, status }
        );
        
        // Atualiza o estado local com o item atualizado
        setItensVerificados(prev => {
          const itemIndex = prev.findIndex(item => item.item_modelo === itemId);
          if (itemIndex >= 0) {
            const novosItens = [...prev];
            novosItens[itemIndex] = response.data;
            return novosItens;
          }
          return prev;
        });
      } else {
        // Cria novo item
        const response = await axiosInstance.post("/api/preventiva/itens-verificados/", {
          cab_preventiva: laudoExistente.id,
          item_modelo: itemId,
          status
        });
        
        // Adiciona o novo item à lista de itens verificados
        setItensVerificados(prev => [...prev, response.data]);
      }

      setMensagem("Status do item atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status do item:", error);
      setMensagem("Erro ao atualizar status do item.");
    }
  };

  const handleAprovarTodos = async () => {
    try {
      const promessas = itensModelo.map(item => {
        const itemVerificado = itensVerificados.find(iv => iv.item_modelo === item.id);
        if (itemVerificado) {
          return axiosInstance.put(
            `/api/preventiva/itens-verificados/${itemVerificado.id}/`,
            { ...itemVerificado, status: 'Aprovado' }
          );
        } else {
          return axiosInstance.post("/api/preventiva/itens-verificados/", {
            cab_preventiva: laudoExistente.id,
            item_modelo: item.id,
            status: 'Aprovado'
          });
        }
      });

      await Promise.all(promessas);
      carregarItensVerificados(laudoExistente.id);
      setMensagem("Todos os itens foram aprovados com sucesso!");
    } catch (error) {
      console.error("Erro ao aprovar todos os itens:", error);
      setMensagem("Erro ao aprovar todos os itens.");
    }
  };

  const handleSalvarConsideracoes = async () => {
    try {
      await axiosInstance.put(
        `/api/preventiva/cab-preventivas/${laudoExistente.id}/`,
        { ...cabecalho, consideracoes_finais: consideracoesFinais }
      );
      setMensagem("Considerações finais salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar considerações finais:", error);
      setMensagem("Erro ao salvar considerações finais.");
    }
  };

  const handleSalvarItensVerificados = async () => {
    try {
      // Verifica se todos os itens foram verificados
      const itensNaoVerificados = itensModelo.filter(item => 
        !itensVerificados.some(iv => iv.item_modelo === item.id)
      );

      if (itensNaoVerificados.length > 0) {
        setMensagem("Por favor, verifique todos os itens antes de salvar.");
        return;
      }

      setMensagem("Itens verificados salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar itens verificados:", error);
      setMensagem("Erro ao salvar itens verificados.");
    }
  };

  const handleGerarLaudoPDF = async () => {
    console.log("Iniciando geração do laudo PDF...");
    
    if (!laudoExistente?.id) {
      console.log("Laudo não existe:", laudoExistente);
      setMensagem("Salve o cabeçalho antes de gerar o laudo.");
      return;
    }

    try {
      console.log("Dados sendo enviados:", {
        ordem_servico_id: id,
        cab_preventiva_id: laudoExistente.id,
        data_emissao: cabecalho.data_emissao,
        data_validade: cabecalho.data_validade,
        executante: cabecalho.executante,
        responsavel: cabecalho.responsavel,
        consideracoes_finais: consideracoesFinais
      });

      const response = await axiosInstance.post(
        "/api/relatorios/gerar-laudo-preventiva/",
        {
          ordem_servico_id: id,
          cab_preventiva_id: laudoExistente.id,
          data_emissao: cabecalho.data_emissao,
          data_validade: cabecalho.data_validade,
          executante: cabecalho.executante,
          responsavel: cabecalho.responsavel,
          consideracoes_finais: consideracoesFinais
        },
        {
          responseType: 'blob'
        }
      );

      console.log("Resposta recebida:", response);

      // Criar um link para download do PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laudo_preventiva_os_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setMensagem("Laudo gerado com sucesso!");
    } catch (error) {
      console.error("Erro detalhado ao gerar laudo:", error);
      console.error("Status do erro:", error.response?.status);
      console.error("Dados do erro:", error.response?.data);
      
      if (error.response?.status === 401) {
        setMensagem("Sua sessão expirou. Por favor, faça login novamente.");
      } else {
        setMensagem("Erro ao gerar laudo.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="p-6 ml-0 md:ml-64 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <div className="absolute border-2 border-blue-600 w-10 h-10 top-2"></div>
            <h2 className="text-2xl font-bold relative -top-0.5">Realizar Preventiva - OS #{id}</h2>
          </div>
        </div>

        {mensagem && (
          <div className={`mb-4 p-4 rounded ${mensagem.includes("Erro") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {mensagem}
          </div>
        )}

        {dadosOS && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <fieldset className="border border-gray-200 p-6 rounded-lg">
              <legend className="text-lg font-semibold text-gray-700 px-2">
                <div className="flex items-center gap-2">
                  <FiBriefcase className="text-blue-600" />
                  Informações da O.S
                </div>
              </legend>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700"><span className="font-medium">Cliente:</span> {dadosOS.cliente_nome} - {dadosOS.cliente_cnpj_cpf}</p>
                <p className="text-gray-700"><span className="font-medium">Equipamento:</span> {dadosOS.equipamento_tipo}, Marca - {dadosOS.equipamento_marca}, Modelo - {dadosOS.equipamento_modelo}, Nº Serie - {dadosOS.equipamento_numero_serie}</p>
              </div>
            </fieldset>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <fieldset className="border border-gray-200 p-6 rounded-lg">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-blue-600" />
                Cabeçalho do Laudo
              </div>
            </legend>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {laudoExistente && laudoExistente.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número do Laudo</label>
                  <input
                    type="text"
                    value={laudoExistente.id}
                    disabled
                    className="w-full border rounded p-2 bg-gray-100"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Execução</label>
                <input
                  type="date"
                  name="data_execucao"
                  value={cabecalho.data_execucao || ""}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Emissão</label>
                <input type="date" name="data_emissao" value={cabecalho.data_emissao || ""} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Validade</label>
                <input type="date" name="data_validade" value={cabecalho.data_validade || ""} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperatura Ambiente (°C)</label>
                <input type="number" name="temp_ambiente" value={cabecalho.temp_ambiente || ""} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Umidade Relativa (%)</label>
                <input type="number" name="umidade_relativa" value={cabecalho.umidade_relativa || ""} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Executante</label>
                <input type="text" name="executante" value={cabecalho.executante || ""} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Responsável</label>
                <input type="text" name="responsavel" value={cabecalho.responsavel || ""} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={cabecalho.status} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="Aberto">Aberto</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>
            </form>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleSalvarCabecalho}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Salvar Cabeçalho
              </button>
            </div>
          </fieldset>
        </div>

        {laudoExistente && laudoExistente.id && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <fieldset className="border border-gray-200 p-6 rounded-lg">
                <legend className="text-lg font-semibold text-gray-700 px-2">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-blue-600" />
                    Checklist
                  </div>
                </legend>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Modelo de Checklist</label>
                  <div className="flex flex-col space-y-4">
                    <select
                      value={modeloSelecionado}
                      onChange={(e) => setModeloSelecionado(e.target.value)}
                      className="w-1/2 border rounded p-2"
                    >
                      <option value="">Selecione um modelo</option>
                      {modelosChecklist.map(modelo => (
                        <option key={modelo.id} value={modelo.id}>{modelo.nome}</option>
                      ))}
                    </select>
                    <div className="flex justify-start">
                      <button
                        onClick={handleSalvarModelo}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Salvar Modelo
                      </button>
                    </div>
                  </div>
                </div>

                {itensModelo.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={handleAprovarTodos}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Aprovar Todos
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aprovado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reprovado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Não se aplica</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {itensModelo.map(item => {
                            const itemVerificado = itensVerificados.find(iv => iv.item_modelo === item.id);
                            return (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.nome_item}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="radio"
                                    name={`status-${item.id}`}
                                    checked={itemVerificado?.status === 'Aprovado'}
                                    onChange={() => handleStatusItem(item.id, 'Aprovado')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="radio"
                                    name={`status-${item.id}`}
                                    checked={itemVerificado?.status === 'Reprovado'}
                                    onChange={() => handleStatusItem(item.id, 'Reprovado')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="radio"
                                    name={`status-${item.id}`}
                                    checked={itemVerificado?.status === 'Não se aplica'}
                                    onChange={() => handleStatusItem(item.id, 'Não se aplica')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleSalvarItensVerificados}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Salvar Itens Verificados
                      </button>
                    </div>
                  </div>
                )}
              </fieldset>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <fieldset className="border border-gray-200 p-6 rounded-lg">
                <legend className="text-lg font-semibold text-gray-700 px-2">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-blue-600" />
                    Considerações Finais
                  </div>
                </legend>
                <textarea
                  value={consideracoesFinais}
                  onChange={(e) => setConsideracoesFinais(e.target.value)}
                  className="w-full border rounded p-2"
                  rows="4"
                  placeholder="Digite as considerações finais aqui..."
                />
                <div className="flex justify-start mt-4">
                  <button
                    onClick={handleSalvarConsideracoes}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Salvar Considerações
                  </button>
                </div>
              </fieldset>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleGerarLaudoPDF}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Gerar Laudo PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RealizarPreventiva;
