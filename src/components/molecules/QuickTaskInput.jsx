import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const QuickTaskInput = ({ onAddTask, projectId, placeholder = "Add a new task..." }) => {
  const [title, setTitle] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim() && onAddTask) {
      onAddTask({
        title: title.trim(),
        projectId: projectId,
        priority: "medium"
      })
      setTitle("")
      setIsExpanded(false)
    }
  }

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const handleCancel = () => {
    setTitle("")
    setIsExpanded(false)
  }

  return (
    <motion.div
      layout
      className="bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-primary-300 transition-colors p-4"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          <Input
            type="text"
            placeholder={placeholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={handleFocus}
            className="border-none bg-transparent p-0 text-base focus:ring-0 focus:border-none placeholder:text-slate-500"
          />
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!title.trim()}
                >
                  <ApperIcon name="Plus" size={14} className="mr-1" />
                  Add Task
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.div>
  )
}

export default QuickTaskInput