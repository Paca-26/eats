import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedTabContentProps {
  activeTab: string;
  children: ReactNode;
}

const AnimatedTabContent = ({ activeTab, children }: AnimatedTabContentProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedTabContent;
