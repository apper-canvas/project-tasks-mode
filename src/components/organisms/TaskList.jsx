import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TaskCard from "@/components/molecules/TaskCard"
import FilterDropdown from "@/components/molecules/FilterDropdown"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"

const TaskList = ({ 
  tasks = [], 
  projects = [],
  onToggleComplete, 
  onEditTask,
  onDeleteTask,
  showProject = false,
  title = "Tasks",
  emptyVariant = "tasks"
}) => {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created")

  // Get project lookup
  const projectsById = projects.reduce((acc, project) => {
    acc[project.Id] = project
    return acc
  }, {})

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case "active":
        return !task.isCompleted
      case "completed":
        return task.isCompleted
      default:
        return true
    }
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case "dueDate":
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      case "created":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  const activeTasks = tasks.filter(t => !t.isCompleted).length
  const completedTasks = tasks.filter(t => t.isCompleted).length

  const sortOptions = [
    { value: "created", label: "Date Created", icon: "Calendar" },
    { value: "priority", label: "Priority", icon: "Flag" },
    { value: "dueDate", label: "Due Date", icon: "Clock" }
  ]

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="text-slate-600 mt-1">No tasks found</p>
          </div>
        </div>
        <Empty variant={emptyVariant} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-600 mt-1">
            {activeTasks} active, {completedTasks} completed
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ApperIcon name="ChevronDown" size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          
          {/* Filter Dropdown */}
          <FilterDropdown
            currentFilter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </div>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <Empty 
          variant="search"
          title="No tasks match your filter"
          description="Try adjusting your filter settings to see more tasks."
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.Id}
                task={task}
                project={projectsById[task.projectId]}
                onToggleComplete={onToggleComplete}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                showProject={showProject}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default TaskList