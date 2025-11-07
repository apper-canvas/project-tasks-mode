import { motion } from "framer-motion"
import { format } from "date-fns"
import Card from "@/components/atoms/Card"
import Checkbox from "@/components/atoms/Checkbox"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const TaskCard = ({ 
  task, 
  project, 
  onToggleComplete, 
  onEdit,
  onDelete,
  showProject = false 
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted
  
  const priorityColors = {
    low: "low",
    medium: "medium", 
    high: "high"
  }

  const handleToggleComplete = () => {
    if (onToggleComplete) {
      onToggleComplete(task.Id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card 
        className={`p-4 border-l-4 transition-all duration-300 ${
          task.isCompleted ? 'opacity-75 bg-slate-50' : 'hover:shadow-md'
        }`}
        style={{ borderLeftColor: project?.color || '#6366f1' }}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className="flex-shrink-0 pt-0.5">
            <Checkbox 
              checked={task.isCompleted}
              onChange={handleToggleComplete}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title and Priority */}
            <div className="flex items-start justify-between gap-3">
              <h4 className={`font-medium text-slate-900 leading-5 ${
                task.isCompleted ? 'line-through text-slate-500' : ''
              }`}>
                {task.title}
              </h4>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={priorityColors[task.priority]} size="sm">
                  {task.priority}
                </Badge>
                
                {onEdit && (
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                  >
                    <ApperIcon name="Edit2" size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p className={`text-sm text-slate-600 leading-relaxed ${
                task.isCompleted ? 'line-through' : ''
              }`}>
                {task.description}
              </p>
            )}

            {/* Project and Due Date */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                {showProject && project && (
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span>{project.name}</span>
                  </div>
                )}
                
                {task.dueDate && (
                  <div className={`flex items-center gap-1 ${
                    isOverdue ? 'text-red-600 font-medium' : ''
                  }`}>
                    <ApperIcon name="Calendar" size={12} />
                    <span>
                      {format(new Date(task.dueDate), 'MMM d')}
                      {isOverdue && ' (overdue)'}
                    </span>
                  </div>
                )}
              </div>

              {task.isCompleted && task.completedAt && (
                <div className="flex items-center gap-1 text-green-600">
                  <ApperIcon name="Check" size={12} />
                  <span>Completed {format(new Date(task.completedAt), 'MMM d')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TaskCard