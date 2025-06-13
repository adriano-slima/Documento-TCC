import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { FiCalendar, FiThermometer, FiDroplet, FiUser, FiCheckCircle, FiXCircle, FiBriefcase } from "react-icons/fi";

const TabelaMedicoes = ({ parametroId, analisadorId, certificadoId, indiceK, onChange, medidasSalvas, onRemoverMedida, onEditarMedida }) => {
  const [medicoes, setMedicoes] = useState([{ valor_referencia: "", leitura1: "", leitura2: "", leitura3: "" }]);
  const [modelos, setModelos] = useState([]);
  const [modeloSelecionado, setModeloSelecionado] = useState("");

  // Carrega medidas existentes quando o parâmetro muda
  useEffect(() => {
    if (parametroId) {
      // Limpa as medidas quando muda o parâmetro
      setMedicoes([{ valor_referencia: "", leitura1: "", leitura2: "", leitura3: "" }]);
      setModeloSelecionado("");

      // Carrega modelos para o parâmetro
      axios.get(`http://localhost:8000/api/calibracao/modelos-parametro/por_parametro/?parametro_id=${parametroId}`)
        .then(res => setModelos(res.data))
        .catch(err => console.error("Erro ao buscar modelos:", err));
    }
  }, [parametroId]);

  // Atualiza as medidas quando medidasSalvas muda
  useEffect(() => {
    if (medidasSalvas && medidasSalvas.length > 0) {
      const medidasFormatadas = medidasSalvas.map(medida => ({
        id: medida.id,
        valor_referencia: medida.valor_referencia,
        leitura1: medida.leitura1,
        leitura2: medida.leitura2,
        leitura3: medida.leitura3
      }));
      setMedicoes(medidasFormatadas);
      onChange(medidasFormatadas);
    }
  }, [medidasSalvas]);

  useEffect(() => {
    if (modeloSelecionado) {
      axios.get(`http://localhost:8000/api/calibracao/valores-modelo/?modelo=${modeloSelecionado}`)
        .then(res => {
          const valores = res.data.map(v => ({ valor_referencia: v.valor, leitura1: "", leitura2: "", leitura3: "" }));
          setMedicoes(valores);
          onChange(valores);
        })
        .catch(err => console.error("Erro ao buscar valores:", err));
    }
  }, [modeloSelecionado]);

  const handleInput = (index, campo, valor) => {
    const novasMedicoes = [...medicoes];
    const medidaAtual = novasMedicoes[index];
    
    // Atualiza o valor no estado local sem formatação
    novasMedicoes[index] = { ...medidaAtual, [campo]: valor };
    setMedicoes(novasMedicoes);
    onChange(novasMedicoes);

    // Se a medida tem ID, significa que está salva no banco e precisa ser atualizada
    if (medidaAtual.id) {
      // Converte os valores para float apenas quando necessário para cálculos
      const leitura1 = campo === 'leitura1' ? parseFloat(valor) : parseFloat(medidaAtual.leitura1 || 0);
      const leitura2 = campo === 'leitura2' ? parseFloat(valor) : parseFloat(medidaAtual.leitura2 || 0);
      const leitura3 = campo === 'leitura3' ? parseFloat(valor) : parseFloat(medidaAtual.leitura3 || 0);
      const valorRef = campo === 'valor_referencia' ? parseFloat(valor) : parseFloat(medidaAtual.valor_referencia || 0);
      
      const media = Number(((leitura1 + leitura2 + leitura3) / 3).toFixed(3));
      const erro = Number((media - valorRef).toFixed(3));
      const tolerancia = Number((valorRef * (indiceK / 100)).toFixed(3));
      const aprovacao = Math.abs(erro) <= tolerancia;

      // Prepara a medida atualizada
      const medidaAtualizada = {
        ...medidaAtual,
        [campo]: valor,
        media: media,
        erro: erro,
        aprovacao: aprovacao,
        analisador: analisadorId,
        certificado: certificadoId,
        indice_k: indiceK
      };

      // Chama a função de edição
      onEditarMedida(medidaAtualizada);
    }
  };

  // Função para formatar o valor para exibição (apenas quando necessário)
  const formatarValor = (valor) => {
    if (valor === "" || valor === null || valor === undefined) return "";
    return valor;
  };

  const adicionarLinha = () => {
    const novasMedicoes = [...medicoes, { valor_referencia: "", leitura1: "", leitura2: "", leitura3: "" }];
    setMedicoes(novasMedicoes);
    onChange(novasMedicoes);
  };

  const removerLinha = async (index) => {
    const medida = medicoes[index];
    if (medida.id) {
      await onRemoverMedida(medida.id);
    }
    const novasMedicoes = medicoes.filter((_, i) => i !== index);
    setMedicoes(novasMedicoes);
    onChange(novasMedicoes);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="block text-sm font-medium text-gray-700">Modelo de Valores:</label>
        <select
          value={modeloSelecionado}
          onChange={(e) => setModeloSelecionado(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Selecione um modelo</option>
          {modelos.map(modelo => (
            <option key={modelo.id} value={modelo.id}>{modelo.nome_modelo}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Referência</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leitura 1</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leitura 2</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leitura 3</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {medicoes.map((medicao, index) => (
            <tr key={medicao.id || index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  step="0.001"
                  value={medicao.valor_referencia}
                  onChange={(e) => handleInput(index, "valor_referencia", e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  step="0.001"
                  value={medicao.leitura1}
                  onChange={(e) => handleInput(index, "leitura1", e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  step="0.001"
                  value={medicao.leitura2}
                  onChange={(e) => handleInput(index, "leitura2", e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  step="0.001"
                  value={medicao.leitura3}
                  onChange={(e) => handleInput(index, "leitura3", e.target.value)}
                  className="border rounded p-2 w-full"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => removerLinha(index)}
                  className="text-red-600 hover:text-red-900"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <div className="relative mr-[9.5rem] -mt-4">
          <div className="absolute border-2 border-blue-600 w-10 h-10 top-2"></div>
          <button
            onClick={adicionarLinha}
            className="text-blue-600 hover:text-blue-800 text-5xl font-bold flex items-center justify-center hover:border-blue-800 leading-none pl-1 relative -top-0.5"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

const TabelaMedidasSalvas = ({ medidas }) => {
  if (!medidas || medidas.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <p className="text-gray-500">Nenhuma medida salva para este parâmetro.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-2">Medidas Salvas</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Referência</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leitura 1</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leitura 2</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leitura 3</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Erro</th>
              {/*   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aprovação</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medidas.map((medida, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{medida.valor_referencia}</td>
                <td className="px-6 py-4 whitespace-nowrap">{medida.leitura1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{medida.leitura2}</td>
                <td className="px-6 py-4 whitespace-nowrap">{medida.leitura3}</td>
                <td className="px-6 py-4 whitespace-nowrap">{medida.media}</td>
                <td className="px-6 py-4 whitespace-nowrap">{medida.erro}</td>
               {/*  <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    medida.aprovacao ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {medida.aprovacao ? 'Aprovado' : 'Reprovado'}
                  </span>
                </td>*/}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TabelaTodasMedidas = ({ medidasSalvas, parametros }) => {
  // Verifica se há medidas salvas
  const temMedidas = Object.values(medidasSalvas).some(medidas => medidas && medidas.length > 0);
  
  if (!temMedidas) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <p className="text-gray-500">Nenhuma medida salva para este laudo.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Todas as Medidas do Laudo</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parâmetro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Referência</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leitura 1</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leitura 2</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leitura 3</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Erro</th>
            {/*   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aprovação</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(medidasSalvas).map(([parametroId, medidas]) => {
              const parametro = parametros.find(p => p.id === parseInt(parametroId));
              return medidas.map((medida, index) => (
                <tr key={`${parametroId}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {parametro ? `${parametro.nome} (${parametro.unidade_medida})` : 'Parâmetro não encontrado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{medida.valor_referencia}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{medida.leitura1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{medida.leitura2}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{medida.leitura3}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{medida.media}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{medida.erro}</td>
                {/*  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      medida.aprovacao ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {medida.aprovacao ? 'Aprovado' : 'Reprovado'}
                    </span>
                  </td>*/}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RealizarCalibracao = () => {
  const { id } = useParams();
  const [cabecalho, setCabecalho] = useState({
    data_execucao: "",
    data_emissao: "",
    data_validade: "",
    temp_ambiente: "",
    umidade_relativa: "",
    executante: "",
    responsavel: "",
    status: "aberto",
    ordem_servico: id,
  });

  const [parametros, setParametros] = useState([]);
  const [parametrosSelecionados, setParametrosSelecionados] = useState([]);
  const [dadosOS, setDadosOS] = useState(null);
  const [laudoExistente, setLaudoExistente] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [analisadores, setAnalisadores] = useState([]);
  const [certificados, setCertificados] = useState({});
  const [medicoes, setMedicoes] = useState({});
  const [indiceK, setIndiceK] = useState({});
  const [analisadoresSelecionados, setAnalisadoresSelecionados] = useState({});
  const [certificadosSelecionados, setCertificadosSelecionados] = useState({});
  const [parametroAtivo, setParametroAtivo] = useState(null);
  const [parametrosCalibrados, setParametrosCalibrados] = useState([]);
  const [cabecalhoSalvo, setCabecalhoSalvo] = useState(false);
  const [medidasSalvas, setMedidasSalvas] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8000/api/ordens/${id}/`).then(res => {
      setDadosOS(res.data);
    });

    axios.get("http://localhost:8000/api/calibracao/parametros/").then(res => {
      setParametros(res.data);
    });

    axios.get("http://localhost:8000/api/calibracao/analisadores/").then(res => {
      setAnalisadores(res.data);
    });

    axios.get(`http://localhost:8000/api/calibracao/cab-calibracoes/por_ordem_servico/?ordem_servico_id=${id}`)
      .then(res => {
        if (res.data && res.data.id) {
          setLaudoExistente(res.data);
          setCabecalho(res.data);
          setCabecalhoSalvo(true);
          
          // Carrega parâmetros calibrados
          axios.get(`http://localhost:8000/api/calibracao/parametros-calibrados/?laudo=${res.data.id}`)
            .then(res => {
              const parametrosCalibrados = res.data;
              setParametrosCalibrados(parametrosCalibrados);
              const ids = parametrosCalibrados.map(p => p.parametro);
              setParametrosSelecionados(ids);
              if (ids.length > 0) {
                setParametroAtivo(ids[0]);
              }
            });
        } else {
          setLaudoExistente(null);
          setParametrosCalibrados([]);
          setParametrosSelecionados([]);
          setParametroAtivo(null);
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          console.log("Nenhum laudo encontrado para esta OS");
          setLaudoExistente(null);
          setParametrosCalibrados([]);
          setParametrosSelecionados([]);
          setParametroAtivo(null);
        } else {
          console.error("Erro ao buscar laudo:", err);
        }
      });
  }, [id]);

  const handleChange = (e) => {
    setCabecalho({ ...cabecalho, [e.target.name]: e.target.value });

    if (e.target.name === "data_execucao" && !laudoExistente) {
      const data = new Date(e.target.value);
      const validade = new Date(data.setFullYear(data.getFullYear() + 1));
      setCabecalho(prev => ({
        ...prev,
        data_validade: validade.toISOString().split("T")[0],
      }));
    }
  };

  const handleSalvarCabecalho = async () => {
    try {
      if (laudoExistente && laudoExistente.id) {
        await axios.put(
          `http://localhost:8000/api/calibracao/cab-calibracoes/${laudoExistente.id}/`,
          cabecalho
        );
        setMensagem("Cabeçalho atualizado com sucesso!");
      } else {
        const res = await axios.post("http://localhost:8000/api/calibracao/cab-calibracoes/", cabecalho);
        setLaudoExistente(res.data);
        setCabecalhoSalvo(true);
        setMensagem("Novo laudo criado com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao salvar cabeçalho:", err);
      setMensagem("Erro ao salvar o cabeçalho.");
    }
  };

  const handleSalvarParametros = async () => {
    if (!laudoExistente?.id) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/calibracao/parametros-calibrados/?laudo=${laudoExistente.id}`);
      const parametrosSalvos = response.data.map(p => p.parametro);

      const novos = parametrosSelecionados.filter(p => !parametrosSalvos.includes(p));
      const removidos = parametrosSalvos.filter(p => !parametrosSelecionados.includes(p));

      const promessas = [];

      novos.forEach(paramId => {
        promessas.push(
          axios.post("http://localhost:8000/api/calibracao/parametros-calibrados/", {
            laudo: laudoExistente.id,
            parametro: paramId
          })
        );
      });

      removidos.forEach(async paramId => {
        const toDelete = response.data.find(p => p.parametro === paramId);
        if (toDelete) {
          promessas.push(
            axios.delete(`http://localhost:8000/api/calibracao/parametros-calibrados/${toDelete.id}/`)
          );
        }
      });

      await Promise.all(promessas);
      
      // Atualiza os parâmetros calibrados após salvar
      const updatedResponse = await axios.get(`http://localhost:8000/api/calibracao/parametros-calibrados/?laudo=${laudoExistente.id}`);
      setParametrosCalibrados(updatedResponse.data);
      
      setMensagem("Parâmetros atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar parâmetros:", error);
      setMensagem("Erro ao atualizar parâmetros.");
    }
  };

  const handleRemoverMedida = async (medidaId) => {
    try {
      await axios.delete(`http://localhost:8000/api/calibracao/medidas/${medidaId}/`);
      setMensagem("Medida removida com sucesso!");
    } catch (error) {
      console.error("Erro ao remover medida:", error);
      setMensagem("Erro ao remover medida.");
    }
  };

  const handleEditarMedida = async (medida) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/calibracao/medidas/${medida.id}/`, medida);
      
      // Atualiza o estado local das medidas
      setMedidasSalvas(prev => {
        const novasMedidas = { ...prev };
        if (novasMedidas[parametroAtivo]) {
          novasMedidas[parametroAtivo] = novasMedidas[parametroAtivo].map(m => 
            m.id === medida.id ? response.data : m
          );
        }
        return novasMedidas;
      });

      // Atualiza o estado local das medições
      setMedicoes(prev => {
        const novasMedicoes = { ...prev };
        if (novasMedicoes[parametroAtivo]) {
          novasMedicoes[parametroAtivo] = novasMedicoes[parametroAtivo].map(m => 
            m.id === medida.id ? {
              ...m,
              valor_referencia: medida.valor_referencia,
              leitura1: medida.leitura1,
              leitura2: medida.leitura2,
              leitura3: medida.leitura3,
              media: medida.media,
              erro: medida.erro,
              aprovacao: medida.aprovacao
            } : m
          );
        }
        return novasMedicoes;
      });

      setMensagem("Medida atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao editar medida:", error);
      setMensagem("Erro ao editar medida.");
    }
  };

  const handleSalvarMedidas = async (parametroId) => {
    if (!laudoExistente?.id || !medicoes[parametroId]) return;

    try {
      // Busca as medidas existentes para este parâmetro
      const response = await axios.get(`http://localhost:8000/api/calibracao/medidas/?laudo=${laudoExistente.id}&parametro=${parametroId}`);
      const medidasExistentes = response.data;

      // Prepara as medidas para salvar
      const medidasParaSalvar = medicoes[parametroId].map(medicao => {
        // Converte os valores para float e garante que sejam números válidos
        const valorRef = parseFloat(medicao.valor_referencia) || 0;
        const leitura1 = parseFloat(medicao.leitura1) || 0;
        const leitura2 = parseFloat(medicao.leitura2) || 0;
        const leitura3 = parseFloat(medicao.leitura3) || 0;
        const indiceKAtual = parseFloat(indiceK[parametroId]) || 0;

        // Calcula a média das leituras com precisão adequada (3 casas decimais)
        const media = Number(((leitura1 + leitura2 + leitura3) / 3).toFixed(3));
        
        // Calcula o erro (diferença entre média e valor de referência)
        const erro = Number((media - valorRef).toFixed(3));
        
        // Calcula a aprovação (erro deve estar dentro da tolerância definida pelo índice K)
        const tolerancia = Number((valorRef * (indiceKAtual / 100)).toFixed(3));
        const aprovacao = Math.abs(erro) <= tolerancia;

        return {
          id: medicao.id,
          laudo: laudoExistente.id,
          parametro: parametroId,
          analisador: analisadoresSelecionados[parametroId],
          certificado: certificadosSelecionados[parametroId],
          indice_k: indiceKAtual,
          valor_referencia: valorRef,
          leitura1: leitura1,
          leitura2: leitura2,
          leitura3: leitura3,
          media: media,
          erro: erro,
          aprovacao: aprovacao
        };
      });

      const promessas = [];

      // Para cada medida existente, verifica se precisa ser atualizada ou removida
      medidasExistentes.forEach(medidaExistente => {
        const medidaAtual = medidasParaSalvar.find(m => m.id === medidaExistente.id);

        if (medidaAtual) {
          // Atualiza medida existente
          promessas.push(
            axios.put(`http://localhost:8000/api/calibracao/medidas/${medidaExistente.id}/`, medidaAtual)
          );
        } else {
          // Remove medida que não está mais na lista
          promessas.push(
            axios.delete(`http://localhost:8000/api/calibracao/medidas/${medidaExistente.id}/`)
          );
        }
      });

      // Adiciona novas medidas
      medidasParaSalvar.forEach(medida => {
        if (!medida.id) {
          // Remove o ID antes de criar uma nova medida
          const { id, ...medidaSemId } = medida;
          promessas.push(
            axios.post("http://localhost:8000/api/calibracao/medidas/", medidaSemId)
          );
        }
      });

      await Promise.all(promessas);
      setMensagem("Medidas salvas com sucesso!");
      carregarMedidasSalvas(parametroId);
    } catch (error) {
      console.error("Erro ao salvar medidas:", error);
      console.error("Detalhes do erro:", error.response?.data);
      setMensagem("Erro ao salvar medidas. Verifique se todos os campos estão preenchidos corretamente.");
    }
  };

  const carregarMedidasSalvas = async (parametroId) => {
    if (!laudoExistente?.id) return;
    
    try {
      const response = await axios.get(`http://localhost:8000/api/calibracao/medidas/?laudo=${laudoExistente.id}&parametro=${parametroId}`);
      setMedidasSalvas(prev => ({ ...prev, [parametroId]: response.data }));
    } catch (error) {
      console.error("Erro ao carregar medidas salvas:", error);
    }
  };

  // Carrega as medidas salvas quando o laudo existente muda
  useEffect(() => {
    if (laudoExistente?.id) {
      parametrosCalibrados.forEach(parametro => {
        carregarMedidasSalvas(parametro.parametro);
      });
    }
  }, [laudoExistente, parametrosCalibrados]);

  // Carrega as medidas salvas quando o parâmetro ativo muda
  useEffect(() => {
    if (parametroAtivo) {
      carregarMedidasSalvas(parametroAtivo);
    }
  }, [parametroAtivo]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="p-6 ml-0 md:ml-64 transition-all">
        <h2 className="text-2xl font-bold mb-4">Realizar Calibração - OS #{id}</h2>

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
                <p className="text-gray-700"><span className="font-medium">Cliente:</span> {dadosOS.cliente_nome} - CNPJ/CPF: {dadosOS.cliente_cnpj_cpf}</p>
                <p className="text-gray-700"><span className="font-medium">Equipamento:</span> {dadosOS.equipamento_tipo} - Marca: {dadosOS.equipamento_marca} - Modelo: {dadosOS.equipamento_modelo} - Nº Série: {dadosOS.equipamento_numero_serie}</p>
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
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
            </form>
            <button
              onClick={handleSalvarCabecalho}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Salvar Cabeçalho
            </button>
          </fieldset>
        </div>

        {laudoExistente && laudoExistente.id && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <fieldset className="border border-gray-200 p-6 rounded-lg">
                <legend className="text-lg font-semibold text-gray-700 px-2">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-blue-600" />
                    Parâmetros a Calibrar
                  </div>
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {parametros.map(parametro => (
                    <div key={parametro.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`parametro-${parametro.id}`}
                        checked={parametrosSelecionados.includes(parametro.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setParametrosSelecionados([...parametrosSelecionados, parametro.id]);
                          } else {
                            setParametrosSelecionados(parametrosSelecionados.filter(id => id !== parametro.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`parametro-${parametro.id}`} className="text-sm text-gray-700">
                        {parametro.nome} ({parametro.unidade_medida})
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSalvarParametros}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Salvar Parâmetros
                </button>
              </fieldset>
            </div>

            {parametrosCalibrados.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <fieldset className="border border-gray-200 p-6 rounded-lg">
                  <legend className="text-lg font-semibold text-gray-700 px-2">
                    <div className="flex items-center gap-2">
                      <FiThermometer className="text-blue-600" />
                      Medidas
                    </div>
                  </legend>
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                      {parametrosCalibrados.map(parametroCalibrado => {
                        const parametro = parametros.find(p => p.id === parametroCalibrado.parametro);
                        return (
                          <button
                            key={parametroCalibrado.id}
                            onClick={() => setParametroAtivo(parametroCalibrado.parametro)}
                            className={`${
                              parametroAtivo === parametroCalibrado.parametro
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                          >
                            {parametro.nome}
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="mt-4">
                    {parametroAtivo && (
                      <div className="border rounded p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Analisador</label>
                            <select
                              value={analisadoresSelecionados[parametroAtivo] || ""}
                              onChange={(e) => {
                                setAnalisadoresSelecionados(prev => ({ ...prev, [parametroAtivo]: parseInt(e.target.value) }));
                                axios.get(`http://localhost:8000/api/calibracao/certificados/?analisador=${e.target.value}`)
                                  .then(res => {
                                    setCertificados(prev => ({ ...prev, [parametroAtivo]: res.data }));
                                  });
                              }}
                              className="w-full border rounded p-2"
                            >
                              <option value="">Selecione um analisador</option>
                              {analisadores
                                .filter(a => a.parametros.some(p => p.id === parametroAtivo))
                                .map(a => (
                                  <option key={a.id} value={a.id}>
                                    {a.marca} {a.modelo} - {a.patrimonio}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Certificado</label>
                            <select
                              value={certificadosSelecionados[parametroAtivo] || ""}
                              onChange={(e) => setCertificadosSelecionados(prev => ({ ...prev, [parametroAtivo]: parseInt(e.target.value) }))}
                              className="w-full border rounded p-2"
                            >
                              <option value="">Selecione um certificado</option>
                              {certificados[parametroAtivo]?.map(c => (
                                <option key={c.id} value={c.id}>
                                  {c.numero_certificado} - Válido até: {new Date(c.data_validade).toLocaleDateString()}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Índice K</label>
                            <input
                              type="number"
                              value={indiceK[parametroAtivo] || ""}
                              onChange={(e) => setIndiceK(prev => ({ ...prev, [parametroAtivo]: parseFloat(e.target.value) }))}
                              className="w-full border rounded p-2"
                            />
                          </div>
                        </div>

                        <TabelaMedicoes
                          parametroId={parametroAtivo}
                          analisadorId={analisadoresSelecionados[parametroAtivo]}
                          certificadoId={certificadosSelecionados[parametroAtivo]}
                          indiceK={indiceK[parametroAtivo]}
                          medidasSalvas={medidasSalvas[parametroAtivo]}
                          onRemoverMedida={handleRemoverMedida}
                          onEditarMedida={handleEditarMedida}
                          onChange={(novasMedicoes) => setMedicoes(prev => ({ ...prev, [parametroAtivo]: novasMedicoes }))}
                        />

                        <button
                          onClick={() => handleSalvarMedidas(parametroAtivo)}
                          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Salvar Medidas
                        </button>

                        <TabelaMedidasSalvas medidas={medidasSalvas[parametroAtivo]} />
                      </div>
                    )}
                  </div>

                  <TabelaTodasMedidas medidasSalvas={medidasSalvas} parametros={parametros} />
                </fieldset>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => window.open(`http://localhost:8000/api/relatorios/laudo-calibracao/${laudoExistente.id}/`, '_blank')}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Gerar Laudo em PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RealizarCalibracao;
