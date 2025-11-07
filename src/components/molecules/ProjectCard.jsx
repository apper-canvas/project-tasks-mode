import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const ProjectCard = ({ project, taskCounts = { active: 0, total: 0 } }) => {
  const { active, total } = taskCounts
  const completedPercentage = total > 0 ? Math.round((total - active) / total * 100) : 0

  return (
    <Link to={`/project/${project.Id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Card 
          interactive
          className="p-6 border-l-4 hover:shadow-xl transition-all duration-300"
          style={{ borderLeftColor: project.color }}
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 truncate">
                  {project.name}
                </h3>
              </div>
              
              <div className="flex items-center space-x-2">
                {active > 0 && (
                  <Badge variant="primary" size="sm">
                    {active} active
                  </Badge>
                )}
                <ApperIcon name="ChevronRight" size={16} className="text-slate-400" />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CheckSquare" size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-600">{total} tasks</span>
                </div>
                
                {total > 0 && (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="TrendingUp" size={16} className="text-green-500" />
                    <span className="text-sm text-green-600 font-medium">
                      {completedPercentage}% complete
                    </span>
                  </div>
                )}
              </div>
              
              <div 
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: project.color }}
              />
            </div>

            {/* Progress Bar */}
            {total > 0 && (
              <div className="space-y-1">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <motion.div 
                    className="h-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${completedPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}

export default ProjectCard