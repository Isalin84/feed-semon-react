import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User } from 'lucide-react';

interface NameInputModalProps {
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export const NameInputModal: React.FC<NameInputModalProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-2xl p-8 max-w-md w-full border-4 border-amber-400"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Закрыть"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Как тебя зовут?
          </h3>
          <p className="text-gray-600">
            Семён хочет поздравить тебя лично! 🐹
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введи своё имя..."
              autoFocus
              maxLength={20}
              className="w-full px-4 py-3 text-lg border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all bg-white"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all duration-200"
            >
              Продолжить
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Имя будет показано на картинке с твоим результатом
        </p>
      </motion.div>
    </motion.div>
  );
};

