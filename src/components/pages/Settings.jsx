import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import ProjectCard from "@/components/molecules/ProjectCard"
import { projectService } from "@/services/api/projectService"

const Settings = () => {
  const { projects, taskCounts, setProjects } = useOutletContext()
  const [isExportLoading, setIsExportLoading] = useState(false)

  const handleExportData = async () => {
    setIsExportLoading(true)
    
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const exportData = {
        projects: projects,
        tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
        exportedAt: new Date().toISOString(),
        version: "1.0"
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `project-tasks-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success("Data exported successfully!")
    } catch (error) {
      toast.error("Failed to export data")
      console.error("Export error:", error)
    } finally {
      setIsExportLoading(false)
    }
  }

  const handleClearAllData = () => {
    const confirmMessage = "This will delete ALL projects and tasks permanently. This action cannot be undone. Are you sure?"
    
    if (window.confirm(confirmMessage)) {
      const doubleConfirm = window.prompt('Type "DELETE ALL" to confirm this action:')
      
      if (doubleConfirm === "DELETE ALL") {
        try {
          localStorage.clear()
          setProjects([])
          toast.success("All data cleared successfully")
          window.location.reload() // Reload to reset app state
        } catch (error) {
          toast.error("Failed to clear data")
          console.error("Clear data error:", error)
        }
      } else {
        toast.info("Data clearing cancelled")
      }
    }
  }

  const handleArchiveProject = async (projectId) => {
    try {
      await projectService.archive(projectId)
      setProjects(prev => prev.filter(p => p.Id !== projectId))
      toast.success("Project archived successfully!")
    } catch (err) {
      toast.error("Failed to archive project")
      console.error("Error archiving project:", err)
    }
  }

  const totalTasks = Object.values(taskCounts).reduce((sum, counts) => sum + counts.total, 0)
  const activeTasks = Object.values(taskCounts).reduce((sum, counts) => sum + counts.active, 0)
  const completedTasks = totalTasks - activeTasks

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-slate-600 mt-2">Manage your projects and application preferences</p>
          </div>
          
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
            <ApperIcon name="Settings" size={24} className="text-primary-600" />
          </div>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
            <ApperIcon name="BarChart3" size={20} className="text-slate-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">{projects.length}</div>
              <div className="text-sm text-slate-600">Active Projects</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-1">{totalTasks}</div>
              <div className="text-sm text-slate-600">Total Tasks</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{activeTasks}</div>
              <div className="text-sm text-slate-600">Active Tasks</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{completedTasks}</div>
              <div className="text-sm text-slate-600">Completed</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Project Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Project Management</h2>
            <ApperIcon name="FolderOpen" size={20} className="text-slate-500" />
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="FolderPlus" size={28} className="text-slate-400" />
              </div>
              <p className="text-slate-500 mb-4">No projects found</p>
              <p className="text-sm text-slate-400">Create a project from the sidebar to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.Id} className="relative group">
                  <ProjectCard 
                    project={project} 
                    taskCounts={taskCounts[project.Id] || { active: 0, total: 0 }}
                  />
                  
                  {/* Archive Button */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleArchiveProject(project.Id)
                      }}
                      className="h-8 w-8 p-0 bg-white shadow-md hover:bg-red-50 hover:text-red-600"
                    >
                      <ApperIcon name="Archive" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Data Management</h2>
              <p className="text-slate-600 text-sm mt-1">Backup and manage your application data</p>
            </div>
            <ApperIcon name="Database" size={20} className="text-slate-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">Export Data</h3>
                <p className="text-sm text-slate-600">Download a backup of all your projects and tasks</p>
              </div>
              <Button
                onClick={handleExportData}
                disabled={isExportLoading}
                variant="secondary"
              >
                {isExportLoading ? (
                  <>
                    <div className="animate-spin mr-2">
                      <ApperIcon name="Loader2" size={16} />
                    </div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Download" size={16} className="mr-2" />
                    Export JSON
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <h3 className="font-medium text-red-900">Clear All Data</h3>
                <p className="text-sm text-red-700">Permanently delete all projects and tasks</p>
              </div>
              <Button
                onClick={handleClearAllData}
                variant="danger"
                className="bg-red-600 hover:bg-red-700"
              >
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Application Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">About Project Tasks</h2>
            <ApperIcon name="Info" size={20} className="text-slate-500" />
          </div>
          
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between py-2">
              <span>Version</span>
              <span className="font-medium text-slate-900">1.0.0</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span>Data Storage</span>
              <span className="font-medium text-slate-900">Browser Local Storage</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span>Last Updated</span>
              <span className="font-medium text-slate-900">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 leading-relaxed">
                Project Tasks helps you organize work into projects with nested tasks. 
                All data is stored locally in your browser and never transmitted to external servers.
                Export your data regularly to keep backups.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Settings