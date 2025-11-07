import { useState } from "react"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ onSearch, placeholder = "Search tasks...", className }) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    
    // Optional: Real-time search with debounce
    if (onSearch && value.length > 2) {
      const timeoutId = setTimeout(() => {
        onSearch(value)
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
        />
<Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && onSearch && onSearch(query)}
          className="pl-10 pr-4"
        />
      </div>
    </form>
  )
}

export default SearchBar