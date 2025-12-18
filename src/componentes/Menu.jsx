import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BotaoTema from './BotaoTema';
import SeletorPerfil from './SeletorPerfil';
import { motion, AnimatePresence } from 'framer-motion'; // Importação da Framer Motion

// Ícone de Hambúrguer
const IconeHamburger = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

// Ícone de Fechar (X)
const IconeFechar = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu se o utilizador clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const fecharMenu = () => setIsOpen(false);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-slate-200 hover:text-accent-300 focus:outline-none"
      >
        {isOpen ? <IconeFechar /> : <IconeHamburger />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-navy-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="py-1">
              <div className="px-4 py-2">
                <SeletorPerfil />
              </div>
              <div className="border-t border-slate-200 dark:border-navy-700 my-1"></div>
              <Link to="/" onClick={fecharMenu} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700">Home</Link>
              <Link to="/filmes" onClick={fecharMenu} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700">Filmes</Link>
              <Link to="/series" onClick={fecharMenu} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700">Séries</Link>
                          <Link
                            to="/favoritos"
                            onClick={fecharMenu}
                            className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700"
                          >
                            Meus Favoritos
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={fecharMenu}
                            className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700"
                          >
                            Dashboard
                          </Link>
                          <div className="border-t border-slate-200 dark:border-navy-700 my-1"></div>
              <div className="px-4 py-2 flex justify-between items-center">
                <span className="text-sm text-slate-700 dark:text-slate-200">Tema</span>
                <BotaoTema />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Menu;