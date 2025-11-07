import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const FilterDropdown = ({ 
  currentFilter, 
  onFilterChange,
  options = [
    { value: "all", label: "All Tasks", icon: "List" },
    { value: "active", label: "Active Tasks", icon: "Circle" },
    { value: "completed", label: "Completed", icon: "CheckCircle" },
  ]
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOption = options.find(opt => opt.value === currentFilter) || options[0]

  const handleSelect = (value) => {
    onFilterChange(value)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <ApperIcon name={selectedOption.icon} size={16} />
        <span>{selectedOption.label}</span>
        <ApperIcon name="ChevronDown" size={16} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left hover:bg-slate-50 ${
                    option.value === currentFilter ? 'bg-primary-50 text-primary-700' : 'text-slate-700'
                  }`}
                >
                  <ApperIcon name={option.icon} size={16} />
                  <span>{option.label}</span>
                  {option.value === currentFilter && (
                    <ApperIcon name="Check" size={14} className="ml-auto text-primary-600" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FilterDropdown