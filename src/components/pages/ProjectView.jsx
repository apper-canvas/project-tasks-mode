import { useState, useEffect } from "react"
import { useParams, useNavigate, useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import TaskList from "@/components/organisms/TaskList"
import TaskModal from "@/components/organisms/TaskModal"
import QuickTaskInput from "@/components/molecules/QuickTaskInput"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"
import { projectService } from "@/services/api/projectService"

const ProjectView = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects, tasks, setTasks, setProjects } = useOutletContext()
  
  const [project, setProject] = useState(null)
  const [projectTasks, setProjectTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Find project and filter tasks
  useEffect(() => {
    const foundProject = projects.find(p => p.Id.toString() === projectId)
    if (foundProject) {
      setProject(foundProject)
      const filteredTasks = tasks.filter(task => task.projectId === foundProject.Id)
      setProjectTasks(filteredTasks)
      setLoading(false)
    } else if (projects.length > 0) {
      setError("Project not found")
      setLoading(false)
    }
  }, [projectId, projects, tasks])

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId)
      
      // Update both local and global task state
      setProjectTasks(prevTasks => 
        prevTasks.map(task => 
          task.Id === taskId ? updatedTask : task
        )
      )
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.Id === taskId ? updatedTask : task
        )
      )
      
      const message = updatedTask.isCompleted ? "Task completed! 🎉" : "Task marked as active"
      toast.success(message)
    } catch (err) {
      toast.error("Failed to update task")
      console.error("Error toggling task completion:", err)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleSaveTask = async (taskData) => {
    try {
      let updatedTask
      
      if (editingTask) {
        // Update existing task
        updatedTask = await taskService.update(editingTask.Id, taskData)
        setProjectTasks(prevTasks => 
          prevTasks.map(task => 
            task.Id === editingTask.Id ? updatedTask : task
          )
        )
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.Id === editingTask.Id ? updatedTask : task
          )
        )
        toast.success("Task updated successfully!")
      } else {
        // Create new task
        const newTaskData = { ...taskData, projectId: project.Id }
        updatedTask = await taskService.create(newTaskData)
        setProjectTasks(prevTasks => [...prevTasks, updatedTask])
        setTasks(prevTasks => [...prevTasks, updatedTask])
        toast.success("Task created successfully!")
      }
      
      setIsTaskModalOpen(false)
      setEditingTask(null)
    } catch (err) {
      throw new Error(err.message || "Failed to save task")
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setProjectTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId))
      setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId))
      toast.success("Task deleted successfully!")
      setIsTaskModalOpen(false)
      setEditingTask(null)
    } catch (err) {
      throw new Error(err.message || "Failed to delete task")
    }
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const handleQuickAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setProjectTasks(prevTasks => [...prevTasks, newTask])
      setTasks(prevTasks => [...prevTasks, newTask])
      toast.success("Task added successfully!")
    } catch (err) {
      toast.error("Failed to add task")
      console.error("Error creating task:", err)
    }
  }

  const handleCloseModal = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  const handleDeleteProject = async () => {
    if (!project) return
    
    const confirmMessage = projectTasks.length > 0 
      ? `This will delete "${project.name}" and all ${projectTasks.length} tasks. Are you sure?`
      : `Are you sure you want to delete "${project.name}"?`
    
    if (window.confirm(confirmMessage)) {
      try {
        // Delete all tasks first
        if (projectTasks.length > 0) {
          await Promise.all(projectTasks.map(task => taskService.delete(task.Id)))
          setTasks(prevTasks => prevTasks.filter(task => task.projectId !== project.Id))
        }
        
        // Then delete project
        await projectService.delete(project.Id)
        setProjects(prevProjects => prevProjects.filter(p => p.Id !== project.Id))
        
        toast.success("Project deleted successfully!")
        navigate("/")
      } catch (err) {
        toast.error("Failed to delete project")
        console.error("Error deleting project:", err)
      }
    }
  }

  const retryLoad = () => {
    window.location.reload()
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorView error={error} onRetry={retryLoad} />
  }

  if (!project) {
    return <ErrorView error="Project not found" />
  }

  // Calculate stats
  const totalTasks = projectTasks.length
  const activeTasks = projectTasks.filter(task => !task.isCompleted).length
  const completedTasks = projectTasks.filter(task => task.isCompleted).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div 
                className="w-6 h-6 rounded-lg"
                style={{ backgroundColor: project.color }}
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {project.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="primary">
                {activeTasks} active tasks
              </Badge>
              {totalTasks > 0 && (
                <Badge variant="success">
                  {completionRate}% complete
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleDeleteProject}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
            <Button
              onClick={handleCreateTask}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <ApperIcon name="List" size={24} className="text-slate-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{activeTasks}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <ApperIcon name="Circle" size={24} className="text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Add Task */}
      <QuickTaskInput
        onAddTask={handleQuickAddTask}
        projectId={project.Id}
        placeholder={`Add a task to ${project.name}...`}
      />

      {/* Task List */}
      {projectTasks.length === 0 ? (
        <Empty 
          variant="tasks" 
          onAction={handleCreateTask}
          title="No tasks in this project"
          description="Start by adding your first task to get organized and boost productivity."
          actionLabel="Add Task"
        />
      ) : (
        <TaskList
          tasks={projectTasks}
          projects={[project]}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          showProject={false}
          title={`Tasks in ${project.name}`}
          emptyVariant="tasks"
        />
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        projects={[project]}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  )
}

export default ProjectView