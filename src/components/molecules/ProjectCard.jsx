import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";
 
const ProjectCard = ({ project, taskCounts = { active: 0, total: 0 }, compact = false }) => {
  if (!project) return null;

  const { active, total } = taskCounts;
  const completedPercentage = total > 0 ? Math.round(((total - active) / total) * 100) : 0;

  return (
    <Link to={`/project/${project.Id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Card
          variant="default"
          interactive
          className={cn(
            "border-l-4 hover:shadow-lg transition-all duration-300",
            compact ? "p-3" : "p-4"
          )}
          style={{ borderLeftColor: project.color }}
        >
          <div className={cn("space-y-3", compact && "space-y-2")}>
            {/* Header */}
            <div className="flex items-center justify-between">
<div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-semibold text-slate-900 truncate",
                  compact ? "text-sm" : "text-base"
                )}>
                  {project.name}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {active > 0 && (
                  <Badge variant="primary" size="sm">
                    {active}
                  </Badge>
                )}
                <ApperIcon name="ChevronRight" size={14} className="text-slate-400" />
              </div>
            </div>
{/* Stats */}
            <div className="flex items-center justify-between">
              <div className={cn(
                "flex items-center",
                compact ? "space-x-2" : "space-x-3"
              )}>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="CheckSquare" size={compact ? 12 : 14} className="text-slate-500" />
                  <span className="text-xs text-slate-600">{total}</span>
                </div>
                
                {total > 0 && (
                  <span className="text-xs text-green-600 font-medium">
                    {completedPercentage}%
                  </span>
                )}
              </div>
              
              <div 
                className="w-2 h-2 rounded-full shadow-sm"
                style={{ backgroundColor: project.color }}
              />
            </div>
{/* Progress Bar */}
            {total > 0 && (
              <div className="space-y-1">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <motion.div 
                    className="h-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${completedPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};

export default ProjectCard;