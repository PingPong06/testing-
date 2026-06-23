import { motion } from "framer-motion";

function DashboardCard({
  title,
  value,
  icon,
  iconBg,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className="
      bg-white
      rounded-2xl
      shadow-lg
      p-6
      cursor-pointer
      "
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm">
            {title}
          </h3>

          <p className="text-3xl font-bold mt-2">
            {value}
          </p>
        </div>

        <div
          className={`${iconBg} p-3 rounded-xl`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardCard;