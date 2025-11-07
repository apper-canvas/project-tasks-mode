import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"

const TaskModal = ({ 
  isOpen, 
  onClose, 
  task = null, 
  projects = [], 
  onSave, 
  onDelete 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "medium",
    dueDate: ""
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data when modal opens or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Edit mode
        setFormData({
          title: task.title || "",
          description: task.description || "",
          projectId: task.projectId?.toString() || "",
          priority: task.priority || "medium",
          dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : ""
        })
      } else {
        // Create mode
        setFormData({
          title: "",
          description: "",
          projectId: projects.length > 0 ? projects[0].Id.toString() : "",
          priority: "medium",
          dueDate: ""
        })
      }
      setErrors({})
    }
  }, [isOpen, task, projects])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (!formData.projectId) {
      newErrors.projectId = "Project is required"
    }
    
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (dueDate < today) {
        newErrors.dueDate = "Due date cannot be in the past"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const taskData = {
        ...formData,
        projectId: parseInt(formData.projectId),
        dueDate: formData.dueDate ? new Date(formData.dueDate + "T23:59:59Z").toISOString() : null
      }
      
      await onSave(taskData)
      onClose()
    } catch (error) {
      console.error("Error saving task:", error)
      setErrors({ submit: error.message || "Failed to save task" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!task || !onDelete) return
    
    if (window.confirm("Are you sure you want to delete this task?")) {
      setIsSubmitting(true)
      try {
        await onDelete(task.Id)
        onClose()
      } catch (error) {
        console.error("Error deleting task:", error)
        setErrors({ submit: error.message || "Failed to delete task" })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (!isOpen) return null

  const selectedProject = projects.find(p => p.Id.toString() === formData.projectId)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            {selectedProject && (
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedProject.color }}
              />
            )}
            <h2 className="text-xl font-semibold text-slate-900">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {task && onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={18} />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Title */}
          <Input
            label="Task Title"
            required
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
            placeholder="Enter task title"
          />

          {/* Description */}
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            error={errors.description}
            placeholder="Add a description (optional)"
            rows={4}
          />

          {/* Project and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Project"
              required
              value={formData.projectId}
              onChange={(e) => handleChange("projectId", e.target.value)}
              error={errors.projectId}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.Id} value={project.Id.toString()}>
                  {project.name}
                </option>
              ))}
            </Select>

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              error={errors.priority}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </Select>
          </div>

          {/* Due Date */}
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            error={errors.dueDate}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2">
                    <ApperIcon name="Loader2" size={16} />
                  </div>
                  {task ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <ApperIcon name={task ? "Save" : "Plus"} size={16} className="mr-2" />
                  {task ? "Update Task" : "Create Task"}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default TaskModal