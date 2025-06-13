import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
    const [menuAberto, setMenuAberto] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate("/");
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white shadow-lg">
            <div className="flex justify-between items-center h-16">
                {/* Logo e Botão do Menu */}
                <div className="flex items-center pl-4">
                    <button 
                        onClick={toggleMenu} 
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link to="/dashboard" className="ml-5 text-xl font-bold hover:text-gray-300 transition-colors duration-200">
                        MedService
                    </Link>
                </div>

                {/* Botão de Logout */}
                <div className="pr-4">
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sair</span>
                    </button>
                </div>
            </div>

            {/* Menu Lateral */}
            {menuAberto && (
                <div className="fixed top-16 left-0 w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
                    <nav className="flex flex-col p-4 space-y-2">
                        <Link 
                            to="/listar-clientes" 
                            className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Clientes</span>
                        </Link>

                        <Link 
                            to="/equipamentos-por-cliente" 
                            className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Equipamentos</span>
                        </Link>

                        <Link 
                            to="/abertura-ordem" 
                            className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>Abertura de OS</span>
                        </Link>

                        <Link 
                            to="/listar-analisadores" 
                            className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <span>Analisadores</span>
                        </Link>

                        <Link 
                            to="/cadastrar-parametro" 
                            className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span>Parâmetros</span>
                        </Link>

                        <Link 
                            to="/cadastrar-modelo" 
                            className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <span>Modelos Calibração</span>
                        </Link>

                        <Link 
                            to="/criar-modelo-preventiva" 
                            className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <span>Modelos Checklist</span>
                        </Link>
                    </nav>
                </div>
            )}
        </div>
    );
}

export default NavBar;