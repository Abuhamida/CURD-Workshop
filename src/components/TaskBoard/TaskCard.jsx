import React from 'react'
import { Edit2, Trash2, User, Calendar } from 'lucide-react'

export default function TaskCard({ task, onEdit, onDelete }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Mission Planning': return 'bg-orange-200 text-orange-800'
      case 'Mission Control Setup': return 'bg-purple-200 text-purple-800'
      case 'Launch Operations': return 'bg-green-200 text-green-800'
      default: return 'bg-gray-200 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow mb-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-gray-500 font-medium">
          OZS-{task.id?.slice(0, 1).toUpperCase()}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
            title="Edit task"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {task.priority && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        )}
        {task.category && (
          <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(task.category)}`}>
            {task.category}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        {task.assigned_to && (
          <div className="flex items-center gap-1">
            <User size={12} />
            <span className="font-medium">{task.assigned_to}</span>
          </div>
        )}
        
        {task.due_date && (
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}