import { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = forwardRef(({ 
  checked, 
  className,
  onChange,
  disabled,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <motion.div
        whileTap={{ scale: 0.95 }}
        onClick={() => !disabled && onChange && onChange({ target: { checked: !checked } })}
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200",
          checked 
            ? "bg-gradient-to-r from-primary-500 to-secondary-500 border-primary-500" 
            : "border-slate-300 hover:border-primary-400 bg-white",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <motion.div
          initial={false}
          animate={{ 
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 25 
          }}
        >
          <ApperIcon name="Check" size={12} className="text-white" />
        </motion.div>
      </motion.div>
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox