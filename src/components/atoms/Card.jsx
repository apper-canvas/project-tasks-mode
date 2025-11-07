import { cn } from "@/utils/cn"

const Card = ({ 
  children, 
  className,
  variant = "default",
  interactive = false,
  ...props 
}) => {
  const baseStyles = "bg-white rounded-xl border border-slate-200 shadow-sm"
  
  const variants = {
    default: "shadow-sm",
    elevated: "shadow-md",
    floating: "shadow-lg"
  }
  
  const interactiveStyles = interactive ? 
    "hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer" : 
    ""
  
  return (
    <div 
      className={cn(baseStyles, variants[variant], interactiveStyles, className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card