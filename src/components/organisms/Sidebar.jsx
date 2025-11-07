import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { projectService } from "@/services/api/projectService"

const Sidebar = ({ projects = [], taskCounts = {}, onCreateProject }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const location = useLocation()
  
  const navigationItems = [
    {
      path: "/",
      label: "All Tasks",
      icon: "List",
      count: Object.values(taskCounts).reduce((sum, counts) => sum + counts.total, 0)
    },
    {
      path: "/search", 
      label: "Search",
      icon: "Search"
    },
    {
      path: "/settings",
      label: "Settings", 
      icon: "Settings"
    }
  ]

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Project Tasks
            </h1>
            <p className="text-sm text-slate-500 mt-1">Organize & Complete</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={20} className="text-primary-600" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-l-4 border-primary-500'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <ApperIcon name={item.icon} size={18} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Projects Section */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Projects</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>

          <div className="space-y-1">
            {projects.map((project) => {
              const counts = taskCounts[project.Id] || { active: 0, total: 0 }
              const isActive = location.pathname === `/project/${project.Id}`
              
              return (
                <NavLink
                  key={project.Id}
                  to={`/project/${project.Id}`}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-4 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                  }`}
                  style={{ 
                    borderLeftColor: isActive ? project.color : 'transparent'
                  }}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate font-medium">{project.name}</span>
                  </div>
                  {counts.active > 0 && (
                    <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full flex-shrink-0">
                      {counts.active}
                    </span>
                  )}
                </NavLink>
              )
            })}

            {projects.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="FolderPlus" size={24} className="text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 mb-3">No projects yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <ApperIcon name="Plus" size={14} className="mr-1" />
                  Create Project
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateProjectModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreateProject={onCreateProject}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Create Project Modal Component
const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#6366f1")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const colorOptions = [
    "#6366f1", "#8b5cf6", "#10b981", "#f59e0b", 
    "#ef4444", "#3b82f6", "#f97316", "#84cc16",
    "#06b6d4", "#ec4899", "#64748b", "#7c3aed"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (name.trim() && !isSubmitting) {
      setIsSubmitting(true)
      try {
        const newProject = await projectService.create({
          name: name.trim(),
          color: selectedColor
        })
        onCreateProject(newProject)
        toast.success(`Project "${newProject.name}" created successfully`)
        setName("")
        setSelectedColor("#6366f1")
        onClose()
      } catch (error) {
        toast.error("Failed to create project. Please try again.")
        console.error("Error creating project:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Create New Project</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            <ApperIcon name="X" size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Project Color
            </label>
            <div className="grid grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  disabled={isSubmitting}
                  className={`w-8 h-8 rounded-full transition-all duration-200 disabled:opacity-50 ${
                    selectedColor === color 
                      ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? (
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              ) : (
                <ApperIcon name="Plus" size={16} className="mr-2" />
              )}
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Sidebar