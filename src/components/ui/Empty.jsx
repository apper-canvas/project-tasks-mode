import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  icon = "Inbox", 
  title = "Nothing here yet", 
  description = "Get started by creating your first item.",
  actionLabel = "Get Started",
  onAction,
  variant = "default"
}) => {
  const variants = {
    tasks: {
      icon: "CheckSquare",
      title: "No tasks yet",
      description: "Create your first task to start organizing your work and boosting productivity.",
      actionLabel: "Add Task"
    },
    projects: {
      icon: "FolderPlus",
      title: "No projects yet",
      description: "Start by creating a project to organize your tasks and stay focused.",
      actionLabel: "Create Project"
    },
    search: {
      icon: "Search",
      title: "No results found",
      description: "Try adjusting your search terms or browse all tasks.",
      actionLabel: "View All Tasks"
    }
  }

  const config = variants[variant] || { icon, title, description, actionLabel }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-64 flex items-center justify-center p-8"
    >
      <div className="text-center space-y-6 max-w-md">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200, 
            damping: 10 
          }}
          className="w-20 h-20 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
        >
          <ApperIcon name={config.icon} className="w-10 h-10 text-primary-500" />
        </motion.div>
        
        <div className="space-y-3">
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent"
          >
            {config.title}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-600 leading-relaxed"
          >
            {config.description}
          </motion.p>
        </div>

        {onAction && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={onAction}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {config.actionLabel}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Empty