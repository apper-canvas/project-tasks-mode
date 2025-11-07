import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import SearchBar from "@/components/molecules/SearchBar"
import TaskList from "@/components/organisms/TaskList"
import TaskModal from "@/components/organisms/TaskModal"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"

const Search = () => {
  const { projects, tasks, setTasks } = useOutletContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery.trim())
      } else if (searchQuery.trim().length === 0) {
        setSearchResults([])
        setHasSearched(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const performSearch = async (query) => {
    try {
      setLoading(true)
      setError("")
      
      const results = await taskService.search(query)
      setSearchResults(results)
      setHasSearched(true)
    } catch (err) {
      setError(err.message)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId)
      
      // Update search results
      setSearchResults(prevResults => 
        prevResults.map(task => 
          task.Id === taskId ? updatedTask : task
        )
      )
      
      // Update global tasks
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
        
        setSearchResults(prevResults => 
          prevResults.map(task => 
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
        updatedTask = await taskService.create(taskData)
        setTasks(prevTasks => [...prevTasks, updatedTask])
        toast.success("Task created successfully!")
        
        // If the new task matches current search, add it to results
        if (updatedTask.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            updatedTask.description.toLowerCase().includes(searchQuery.toLowerCase())) {
          setSearchResults(prevResults => [...prevResults, updatedTask])
        }
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
      
      setSearchResults(prevResults => 
        prevResults.filter(task => task.Id !== taskId)
      )
      setTasks(prevTasks => 
        prevTasks.filter(task => task.Id !== taskId)
      )
      
      toast.success("Task deleted successfully!")
      setIsTaskModalOpen(false)
      setEditingTask(null)
    } catch (err) {
      throw new Error(err.message || "Failed to delete task")
    }
  }

  const handleCloseModal = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  const retrySearch = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
    }
  }

  // Group results by project
  const groupedResults = searchResults.reduce((groups, task) => {
    const project = projects.find(p => p.Id === task.projectId)
    const projectName = project ? project.name : 'Unknown Project'
    
    if (!groups[projectName]) {
      groups[projectName] = {
        project,
        tasks: []
      }
    }
    
    groups[projectName].tasks.push(task)
    return groups
  }, {})

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Search Tasks
            </h1>
            <p className="text-slate-600 mt-2">Find tasks across all your projects</p>
          </div>
          
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
            <ApperIcon name="Search" size={24} className="text-primary-600" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by task title or description..."
            className="w-full"
          />
        </div>

        {/* Search Stats */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-6 text-sm text-slate-600"
          >
            <span>
              Found <strong className="text-slate-900">{searchResults.length}</strong> 
              {searchResults.length === 1 ? ' task' : ' tasks'} 
              {searchQuery && (
                <span> matching <strong className="text-slate-900">"{searchQuery}"</strong></span>
              )}
            </span>
            
            {searchResults.length > 0 && (
              <span>
                across <strong className="text-slate-900">{Object.keys(groupedResults).length}</strong> 
                {Object.keys(groupedResults).length === 1 ? ' project' : ' projects'}
              </span>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Content */}
      <div className="space-y-6">
        {/* Loading State */}
        {loading && <Loading />}
        
        {/* Error State */}
        {error && !loading && (
          <ErrorView error={error} onRetry={retrySearch} />
        )}
        
        {/* Empty States */}
        {!loading && !error && !hasSearched && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Search" size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Start searching</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Enter at least 2 characters to search through your tasks by title or description.
            </p>
          </div>
        )}
        
        {!loading && !error && hasSearched && searchResults.length === 0 && (
          <Empty variant="search" />
        )}

        {/* Search Results */}
        {!loading && !error && searchResults.length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedResults).map(([projectName, { project, tasks }]) => (
              <motion.div
                key={projectName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Project Header */}
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                  {project && (
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                  )}
                  <h3 className="text-lg font-semibold text-slate-900">{projectName}</h3>
                  <span className="bg-slate-100 text-slate-700 text-sm px-2 py-1 rounded-full">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>

                {/* Project Tasks */}
                <TaskList
                  tasks={tasks}
                  projects={project ? [project] : []}
                  onToggleComplete={handleToggleComplete}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  showProject={false}
                  title=""
                  emptyVariant="search"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

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

export default Search