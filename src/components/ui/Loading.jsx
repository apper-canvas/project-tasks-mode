import { motion } from "framer-motion"

const Loading = ({ variant = "default" }) => {
  if (variant === "skeleton") {
    return (
      <div className="space-y-4 p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gradient-to-r from-slate-200 to-slate-300 h-6 w-3/4 rounded mb-2"></div>
            <div className="bg-gradient-to-r from-slate-200 to-slate-300 h-4 w-full rounded mb-1"></div>
            <div className="bg-gradient-to-r from-slate-200 to-slate-300 h-4 w-2/3 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-64 flex items-center justify-center">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto"
        />
        <div className="space-y-2">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            <div className="w-4 h-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto animate-pulse"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading tasks...</p>
        </div>
      </div>
    </div>
  )
}

export default Loading