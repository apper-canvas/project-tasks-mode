import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  projects = [], 
  taskCounts = {},
  onCreateProject 
}) => {
  const location = useLocation()
  
  const navigationItems = [
    {
      path: "/",
      label: "All Tasks",
      icon: "List",
      count: Object.values(taskCounts).reduce((sum, counts) => sum + counts.total, 0)
    },
    {
      path: "/search", 
      label: "Search",
      icon: "Search"
    },
    {
      path: "/settings",
      label: "Settings", 
      icon: "Settings"
    }
  ]

  const handleLinkClick = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Project Tasks
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">Organize & Complete</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-1">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-l-4 border-primary-500'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <ApperIcon name={item.icon} size={18} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Projects Section */}
              <div className="px-4 py-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">Projects</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onCreateProject()
                      onClose()
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </Button>
                </div>

                <div className="space-y-1">
                  {projects.map((project) => {
                    const counts = taskCounts[project.Id] || { active: 0, total: 0 }
                    const isActive = location.pathname === `/project/${project.Id}`
                    
                    return (
                      <NavLink
                        key={project.Id}
                        to={`/project/${project.Id}`}
                        onClick={handleLinkClick}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-4 ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                        }`}
                        style={{ 
                          borderLeftColor: isActive ? project.color : 'transparent'
                        }}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                          <span className="truncate font-medium">{project.name}</span>
                        </div>
                        {counts.active > 0 && (
                          <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full flex-shrink-0">
                            {counts.active}
                          </span>
                        )}
                      </NavLink>
                    )
                  })}

                  {projects.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <ApperIcon name="FolderPlus" size={24} className="text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500 mb-3">No projects yet</p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          onCreateProject()
                          onClose()
                        }}
                      >
                        <ApperIcon name="Plus" size={14} className="mr-1" />
                        Create Project
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar