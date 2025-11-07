import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Sidebar from "@/components/organisms/Sidebar";
import TaskModal from "@/components/organisms/TaskModal";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
const Layout = () => {
  const location = useLocation()
  const params = useParams()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [taskCounts, setTaskCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Get current project for header display
  const currentProjectId = params.projectId ? parseInt(params.projectId) : null
  const currentProject = currentProjectId ? projects.find(p => p.Id === currentProjectId) : null

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData)
        setTasks(prev => prev.map(task => task.Id === updatedTask.Id ? updatedTask : task))
        toast.success("Task updated successfully!")
      } else {
        // Set project if we're on a project page
        if (currentProjectId) {
          taskData.ProjectId = currentProjectId
        }
        const newTask = await taskService.create(taskData)
        setTasks(prev => [...prev, newTask])
        toast.success("Task created successfully!")
      }
      setIsTaskModalOpen(false)
      setEditingTask(null)
    } catch (error) {
      console.error('Error saving task:', error)
      toast.error('Failed to save task')
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    // Navigate to search page with query
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    }
  }

  const truncateText = (text, maxLength = 30) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

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
    } catch (err) {
      toast.error("Failed to create project")
      console.error("Error creating project:", err)
    }
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
onCreateProject={handleCreateProject}
      />

{/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <div className="flex items-center space-x-2 flex-1 mx-3">
              {currentProject ? (
                <div className="text-center">
                  <h1 className="font-bold text-slate-900 text-sm">{currentProject.Name}</h1>
                  {currentProject.Description && (
                    <p className="text-xs text-slate-500">{truncateText(currentProject.Description, 25)}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="CheckSquare" size={16} className="text-primary-600" />
                  </div>
                  <h1 className="font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Project Tasks
                  </h1>
                </div>
              )}
            </div>
            
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateTask}
              className="h-8"
            >
              <ApperIcon name="Plus" size={14} />
            </Button>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="w-full">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search tasks..."
              className="w-full"
            />
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-slate-200">
          <div className="container mx-auto px-8 py-4 max-w-7xl">
            <div className="flex items-center justify-between">
              {/* Project Info or App Title */}
              <div className="flex items-center space-x-4">
                {currentProject ? (
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">{currentProject.Name}</h1>
                    {currentProject.Description && (
                      <p className="text-sm text-slate-600 mt-1">{truncateText(currentProject.Description, 60)}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="CheckSquare" size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        Project Tasks
                      </h1>
                      <p className="text-sm text-slate-500">Manage your projects and tasks</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Search and Actions */}
              <div className="flex items-center space-x-4">
                <div className="w-80">
                  <SearchBar 
                    onSearch={handleSearch}
                    placeholder="Search tasks..."
                  />
                </div>
                
                <Button
                  variant="primary"
                  onClick={handleCreateTask}
                  className="h-10 px-4"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add Task
                </Button>
              </div>
            </div>
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

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSave={handleSaveTask}
        task={editingTask}
        projects={projects}
        initialProjectId={currentProjectId}
      />
    </div>
  )
}

export default Layout