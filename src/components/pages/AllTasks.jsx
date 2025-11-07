import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import TaskList from "@/components/organisms/TaskList"
import TaskModal from "@/components/organisms/TaskModal"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"

const AllTasks = () => {
  const { projects, tasks, setTasks } = useOutletContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId)
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
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.Id === editingTask.Id ? updatedTask : task
          )
        )
        toast.success("Task updated successfully!")
      } else {
        // Create new task
        updatedTask = await taskService.create(taskData)
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
      setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId))
      toast.success("Task deleted successfully!")
      setIsTaskModalOpen(false)
      setEditingTask(null)
    } catch (err) {
      throw new Error(err.message || "Failed to delete task")
    }
  }

  const handleCreateTask = () => {
    if (projects.length === 0) {
      toast.error("Please create a project first")
      return
    }
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  const retryLoad = () => {
    // Trigger reload from parent Layout component
    window.location.reload()
  }

  // Calculate stats
  const totalTasks = tasks.length
  const activeTasks = tasks.filter(task => !task.isCompleted).length
  const completedTasks = tasks.filter(task => task.isCompleted).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorView error={error} onRetry={retryLoad} />
  }

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              All Tasks
            </h1>
            <p className="text-slate-600 mt-2">Welcome to your task management dashboard</p>
          </div>
          
          <Button
            onClick={handleCreateTask}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
            disabled={projects.length === 0}
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Task
          </Button>
        </div>

        <Empty 
          variant="tasks" 
          onAction={projects.length > 0 ? handleCreateTask : undefined}
          title={projects.length === 0 ? "Create a project first" : "No tasks yet"}
          description={projects.length === 0 ? 
            "Start by creating a project to organize your tasks." : 
            "Create your first task to start organizing your work and boosting productivity."
          }
          actionLabel={projects.length === 0 ? undefined : "Create Task"}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              All Tasks
            </h1>
            <p className="text-slate-600 mt-2">Manage tasks across all your projects</p>
          </div>
          
          <Button
            onClick={handleCreateTask}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
            disabled={projects.length === 0}
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                <ApperIcon name="List" size={24} className="text-primary-600" />
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

          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completion Rate</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Task List */}
      <TaskList
        tasks={tasks}
        projects={projects}
        onToggleComplete={handleToggleComplete}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        showProject={true}
        title="All Tasks"
        emptyVariant="tasks"
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        projects={projects}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  )
}

export default AllTasks