import { motion } from 'framer-motion';

const FadeView: React.FC<{ children: React.ReactNode; duration?: number }> = ({ children, duration = 300 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, transform: 'translateY(20px)' }}
      animate={{ opacity: 1, transform: 'translateY(0)' }}
      exit={{ opacity: 0, transform: 'translateY(20px)' }}
      transition={{ duration: duration / 1000 }}
    >
      {children}
    </motion.div>
  );
};

export default FadeView;
