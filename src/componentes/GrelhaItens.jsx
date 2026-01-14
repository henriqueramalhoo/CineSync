import ItemCarrossel from './ItemCarrossel';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Atraso entre a animação de cada item
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function GrelhaItens({ itens, tipo, onRemover }) {
  if (!itens || itens.length === 0) {
    return <p className="text-center text-slate-500 dark:text-slate-400 mt-8">Nenhum item para mostrar.</p>;
  }

  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {itens.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          <ItemCarrossel item={item} tipo={tipo} onRemover={onRemover} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default GrelhaItens;
