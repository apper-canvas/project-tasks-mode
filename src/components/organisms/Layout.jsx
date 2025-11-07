import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { toast } from "react-toastify"
import Sidebar from "@/components/organisms/Sidebar"
import MobileSidebar from "@/components/organisms/MobileSidebar"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { projectService } from "@/services/api/projectService"
import { taskService } from "@/services/api/taskService"

const Layout = () => {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [taskCounts, setTaskCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  // Calculate task counts when projects or tasks change
  useEffect(() => {
    const counts = {}
    projects.forEach(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.Id)
      counts[project.Id] = {
        active: projectTasks.filter(task => !task.isCompleted).length,
        total: projectTasks.length
      }
    })
    setTaskCounts(counts)
  }, [projects, tasks])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ])
      
      setProjects(projectsData)
      setTasks(tasksData)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData)
      setProjects(prev => [...prev, newProject])
      toast.success("Project created successfully!")
      setIsCreateProjectModalOpen(false)
    } catch (err) {
      toast.error("Failed to create project")
      console.error("Error creating project:", err)
    }
  }

  const openCreateProjectModal = () => {
    setIsCreateProjectModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading Project Tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          projects={projects}
          taskCounts={taskCounts}
          onCreateProject={handleCreateProject}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        projects={projects}
        taskCounts={taskCounts}
        onCreateProject={openCreateProjectModal}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={16} className="text-primary-600" />
              </div>
              <h1 className="font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Project Tasks
              </h1>
            </div>
            
            <div className="w-8"></div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <main className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
            <Outlet context={{ 
              projects, 
              tasks, 
              taskCounts,
              setTasks,
              setProjects,
              onCreateProject: handleCreateProject,
              loadData
            }} />
          </main>
        </div>
      </div>

      {/* Create Project Modal */}
      {isCreateProjectModalOpen && (
        <CreateProjectModal
          isOpen={isCreateProjectModalOpen}
          onClose={() => setIsCreateProjectModalOpen(false)}
          onCreateProject={handleCreateProject}
        />
      )}
    </div>
  )
}

// Create Project Modal Component (similar to the one in Sidebar)
const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#6366f1")
  
  const colorOptions = [
    "#6366f1", "#8b5cf6", "#10b981", "#f59e0b", 
    "#ef4444", "#3b82f6", "#f97316", "#84cc16",
    "#06b6d4", "#ec4899", "#64748b", "#7c3aed"
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onCreateProject({
        name: name.trim(),
        color: selectedColor
      })
      setName("")
      setSelectedColor("#6366f1")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Create New Project</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
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
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${
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
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Layout