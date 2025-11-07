import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 max-w-lg"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200, 
            damping: 15 
          }}
          className="relative"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
            <ApperIcon name="MapPin" size={48} className="text-primary-600" />
          </div>
          
          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-lg flex items-center justify-center shadow-lg"
          >
            <ApperIcon name="Star" size={16} className="text-yellow-600" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-2 -left-6 w-6 h-6 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center shadow-lg"
          >
            <ApperIcon name="Sparkles" size={12} className="text-green-600" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-slate-900">
              Page Not Found
            </h2>
          </div>
          
          <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              as={Link}
              to="/"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="Home" size={16} className="mr-2" />
              Back to Home
            </Button>
            
            <Button
              as={Link}
              to="/search"
              variant="secondary"
              className="shadow-md hover:shadow-lg"
            >
              <ApperIcon name="Search" size={16} className="mr-2" />
              Search Tasks
            </Button>
          </div>
          
          <div className="text-sm text-slate-500">
            <p>Need help? Try searching for tasks or check out your projects.</p>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-8 border-t border-slate-200"
        >
          <p className="text-sm text-slate-500 mb-3">Quick links:</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link 
              to="/" 
              className="text-primary-600 hover:text-primary-700 transition-colors flex items-center space-x-1"
            >
              <ApperIcon name="List" size={14} />
              <span>All Tasks</span>
            </Link>
            <Link 
              to="/search" 
              className="text-primary-600 hover:text-primary-700 transition-colors flex items-center space-x-1"
            >
              <ApperIcon name="Search" size={14} />
              <span>Search</span>
            </Link>
            <Link 
              to="/settings" 
              className="text-primary-600 hover:text-primary-700 transition-colors flex items-center space-x-1"
            >
              <ApperIcon name="Settings" size={14} />
              <span>Settings</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound