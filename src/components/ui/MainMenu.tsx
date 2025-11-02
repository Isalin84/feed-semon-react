import { motion } from 'framer-motion';
import { Play, Sparkles, ShieldAlert } from 'lucide-react';

interface MainMenuProps {
  onStart: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-yellow-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8"
      >
        {/* Title */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 mb-4 font-game">
            Накорми Семёна
          </h1>
          <p className="text-lg sm:text-xl text-gray-700">
            Помоги морской свинке поймать овощи!
          </p>
        </motion.div>

        {/* Main menu card */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-4xl backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/50"
        >
          {/* Controls section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-600">Управление</h3>
            </div>
            <div className="flex items-center gap-3 text-gray-700 bg-blue-50/50 rounded-xl p-4">
              <div className="flex gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <img src="/assets/images/arrow_left.png" alt="←" className="w-8 h-8" />
                </div>
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <img src="/assets/images/arrow_right.png" alt="→" className="w-8 h-8" />
                </div>
              </div>
              <span className="font-medium">Стрелки или касание экрана</span>
            </div>
          </div>

          {/* Vegetables section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <img src="/assets/images/icon_dill_small.png" alt="🌿" className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-green-600">Полезные овощи</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <VegetableCard
                icon="/assets/images/icon_dill_small.png"
                name="Укроп"
                points="+5"
                color="green"
              />
              <VegetableCard
                icon="/assets/images/icon_carrot_small.png"
                name="Морковь"
                points="+2"
                color="orange"
              />
              <VegetableCard
                icon="/assets/images/icon_zucchini_small.png"
                name="Кабачок"
                points="+3"
                color="emerald"
              />
            </div>
          </div>

          {/* Bonuses section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <img src="/assets/images/icon_star.png" alt="⭐" className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-orange-600">Бонусы</h3>
            </div>
            <div className="bg-orange-50/50 rounded-xl p-4 text-gray-700">
              <div className="flex items-center gap-2 font-medium">
                <img src="/assets/images/pepper.png" alt="Перец" className="w-10 h-10" />
                <span className="text-orange-600 font-bold">Перец</span> (комбо x2) +10
              </div>
              <div className="flex items-center gap-2 font-medium mt-2">
                <img src="/assets/images/heart_bonus.png" alt="Сердце" className="w-10 h-10" />
                <span className="text-red-600 font-bold">Сердце</span> +1 жизнь
              </div>
            </div>
          </div>

          {/* Danger section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-600">ОПАСНО!</h3>
            </div>
            <div className="bg-red-50/50 rounded-xl p-4 text-gray-700 border-2 border-red-200">
              <div className="flex items-center justify-center gap-3">
                <img src="/assets/images/stone.png" alt="Камень" className="w-12 h-12" />
                <p className="font-bold text-red-600">Камни и Шоколад — Избегайте их!</p>
                <img src="/assets/images/chocolate.png" alt="Шоколад" className="w-12 h-12" />
              </div>
            </div>
          </div>

          {/* Game info and start button */}
          <div className="text-center">
            <p className="text-gray-700 mb-6 text-lg">
              У тебя <span className="font-bold text-red-600">5 жизней</span>. Пройди{' '}
              <span className="font-bold text-green-600">3 уровня</span>!
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="group relative px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-6 h-6" />
                Начать игру
              </span>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
                style={{ opacity: 0.2 }}
              />
            </motion.button>
            
            <p className="text-sm text-gray-500 mt-4">
              Нажми ПРОБЕЛ для начала
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-gray-600 text-sm"
        >
          Образовательная игра для детей 🐹
        </motion.p>
      </motion.div>
    </div>
  );
};

// Helper component for vegetable cards
interface VegetableCardProps {
  icon: string;
  name: string;
  points: string;
  color: 'green' | 'orange' | 'emerald';
}

const VegetableCard: React.FC<VegetableCardProps> = ({ icon, name, points, color }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className={`${colorClasses[color]} border-2 rounded-xl p-3 text-center transition-all duration-200`}
    >
      <img
        src={icon}
        alt={name}
        className="w-10 h-10 mx-auto mb-2"
        onError={(e) => {
          // Fallback if image doesn't load
          e.currentTarget.style.display = 'none';
        }}
      />
      <p className="font-bold text-sm">{name}</p>
      <p className="text-xs font-semibold mt-1">{points}</p>
    </motion.div>
  );
};

