import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
import NavBar from "../components/NavBar";
import InputMask from 'react-input-mask';
import { FiBriefcase, FiPhone, FiMapPin } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CadastroClientes() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const [errors, setErrors] = useState({});
    const [cliente, setCliente] = useState({
        nome_fantasia: "",
        razao_social: "",
        tipo_cliente: "Pessoa Jurídica",
        cnpj_cpf: "",
        telefone: "",
        telefone2: "",
        email: "",
        nome_contato: "",
        cargo: "",
        setor: "",
        cep: "",
        uf: "",
        cidade: "",
        endereco: "",
        numero: "",
        complemento: "",
        status: "Ativo"
    });

    // Validação em tempo real
    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "nome_fantasia":
                if (!value) error = "Nome fantasia é obrigatório";
                break;
            case "razao_social":
                if (!value) error = "Razão social é obrigatória";
                break;
            case "cnpj_cpf":
                if (!value) error = "CNPJ/CPF é obrigatório";
                else if (cliente.tipo_cliente === "Pessoa Jurídica" && value.replace(/\D/g, "").length !== 14)
                    error = "CNPJ inválido";
                else if (cliente.tipo_cliente === "Pessoa Física" && value.replace(/\D/g, "").length !== 11)
                    error = "CPF inválido";
                break;
            case "email":
                if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
                    error = "Email inválido";
                break;
            case "cep":
                if (value && value.replace(/\D/g, "").length !== 8)
                    error = "CEP inválido";
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({ ...prev, [name]: value }));
        setFormChanged(true);
        
        // Validação em tempo real
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // Busca de CEP
    const handleCepBlur = async () => {
        if (cliente.cep.replace(/\D/g, "").length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cliente.cep.replace(/\D/g, "")}/json/`);
                if (!response.data.erro) {
                    setCliente(prev => ({
                        ...prev,
                        endereco: response.data.logradouro,
                        cidade: response.data.localidade,
                        uf: response.data.uf
                    }));
                } else {
                    toast.error("CEP não encontrado");
                }
            } catch (error) {
                toast.error("Erro ao buscar CEP");
            }
        }
    };

    // Confirmação antes de sair
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (formChanged) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [formChanged]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação final
        const finalErrors = {};
        Object.keys(cliente).forEach(key => {
            const error = validateField(key, cliente[key]);
            if (error) finalErrors[key] = error;
        });

        if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);
            toast.error("Por favor, corrija os erros no formulário");
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post("/api/clientes/", cliente, {
            });
            toast.success("Cliente cadastrado com sucesso!");
            setFormChanged(false);
            navigate("/dashboard");
        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error.response?.data || error.message);
            toast.error("Erro ao cadastrar cliente: " + (error.response?.data?.message || "Erro desconhecido"));
        } finally {
            setLoading(false);
        }
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

    const estados = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
        "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar/>
            <ToastContainer position="top-right" autoClose={5000} />

            <div className="pt-16 px-6 ml-0 md:ml-64 mt-4 transition-all max-w-7xl mx-auto">
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <span onClick={() => handleCancel()} className="cursor-pointer hover:text-blue-600">Dashboard</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">Cadastro de Clientes</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Clientes</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiBriefcase className="text-blue-600" />
                                    Dados do Cliente
                                </div>
                            </legend>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome Fantasia <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="nome_fantasia" 
                                        value={cliente.nome_fantasia} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.nome_fantasia ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        required 
                                    />
                                    {errors.nome_fantasia && <p className="text-red-500 text-sm mt-1">{errors.nome_fantasia}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Razão Social
                                    </label>
                                    <input 
                                        type="text" 
                                        name="razao_social" 
                                        value={cliente.razao_social} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.razao_social ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.razao_social && <p className="text-red-500 text-sm mt-1">{errors.razao_social}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Cliente
                                    </label>
                                    <select 
                                        name="tipo_cliente" 
                                        value={cliente.tipo_cliente} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.tipo_cliente ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    >
                                        <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                                        <option value="Pessoa Física">Pessoa Física</option>
                                    </select>
                                    {errors.tipo_cliente && <p className="text-red-500 text-sm mt-1">{errors.tipo_cliente}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CNPJ/CPF <span className="text-red-500">*</span>
                                    </label>
                                    <InputMask 
                                        mask={cliente.tipo_cliente === "Pessoa Jurídica" ? "99.999.999/9999-99" : "999.999.999-99"}
                                        type="text" 
                                        name="cnpj_cpf" 
                                        value={cliente.cnpj_cpf} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.cnpj_cpf ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        required 
                                    />
                                    {errors.cnpj_cpf && <p className="text-red-500 text-sm mt-1">{errors.cnpj_cpf}</p>}
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiPhone className="text-blue-600" />
                                    Contato
                                </div>
                            </legend>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                    <InputMask 
                                        mask="(99) 99999-9999"
                                        type="text" 
                                        name="telefone" 
                                        value={cliente.telefone} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.telefone ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone 2</label>
                                    <InputMask 
                                        mask="(99) 99999-9999"
                                        type="text" 
                                        name="telefone2" 
                                        value={cliente.telefone2} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.telefone2 ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.telefone2 && <p className="text-red-500 text-sm mt-1">{errors.telefone2}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={cliente.email} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Contato</label>
                                    <input 
                                        type="text" 
                                        name="nome_contato" 
                                        value={cliente.nome_contato} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.nome_contato ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.nome_contato && <p className="text-red-500 text-sm mt-1">{errors.nome_contato}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                                    <input 
                                        type="text" 
                                        name="cargo" 
                                        value={cliente.cargo} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.cargo ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.cargo && <p className="text-red-500 text-sm mt-1">{errors.cargo}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
                                    <input 
                                        type="text" 
                                        name="setor" 
                                        value={cliente.setor} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.setor ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.setor && <p className="text-red-500 text-sm mt-1">{errors.setor}</p>}
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="border border-gray-200 p-6 rounded-lg">
                            <legend className="text-lg font-semibold text-gray-700 px-2">
                                <div className="flex items-center gap-2">
                                    <FiMapPin className="text-blue-600" />
                                    Endereço
                                </div>
                            </legend>
                            <div className="grid md:grid-cols-3 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                    <InputMask 
                                        mask="99999-999"
                                        type="text" 
                                        name="cep" 
                                        value={cliente.cep} 
                                        onChange={handleChange}
                                        onBlur={handleCepBlur}
                                        className={`w-full border ${errors.cep ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                                    <select 
                                        name="uf" 
                                        value={cliente.uf} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.uf ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    >
                                        <option value="">Selecione</option>
                                        {estados.map((estado) => (
                                            <option key={estado} value={estado}>{estado}</option>
                                        ))}
                                    </select>
                                    {errors.uf && <p className="text-red-500 text-sm mt-1">{errors.uf}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                    <input 
                                        type="text" 
                                        name="cidade" 
                                        value={cliente.cidade} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.cidade ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                                    <input 
                                        type="text" 
                                        name="endereco" 
                                        value={cliente.endereco} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.endereco ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                    <input 
                                        type="text" 
                                        name="numero" 
                                        value={cliente.numero} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.numero ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                                    <input 
                                        type="text" 
                                        name="complemento" 
                                        value={cliente.complemento} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.complemento ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    />
                                    {errors.complemento && <p className="text-red-500 text-sm mt-1">{errors.complemento}</p>}
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
                                {loading ? "Cadastrando..." : "Cadastrar Cliente"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
