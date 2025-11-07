import tasksData from "@/services/mockData/tasks.json"

let tasks = [...tasksData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const taskService = {
  async getAll() {
    await delay()
    return [...tasks]
  },

  async getByProjectId(projectId) {
    await delay()
    return tasks.filter(task => task.projectId === parseInt(projectId))
  },

  async getById(id) {
    await delay()
    const task = tasks.find(t => t.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  },

  async create(taskData) {
    await delay()
    const maxId = Math.max(...tasks.map(t => t.Id), 0)
    const newTask = {
      Id: maxId + 1,
      projectId: parseInt(taskData.projectId),
      title: taskData.title,
      description: taskData.description || "",
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || "medium",
      isCompleted: false,
      completedAt: null,
      createdAt: new Date().toISOString()
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, taskData) {
    await delay()
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    tasks[index] = {
      ...tasks[index],
      ...taskData
    }
    return { ...tasks[index] }
  },

  async toggleComplete(id) {
    await delay()
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    const isCompleted = !tasks[index].isCompleted
    tasks[index] = {
      ...tasks[index],
      isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : null
    }
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay()
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    tasks.splice(index, 1)
    return true
  },

  async search(query) {
    await delay()
    const lowerQuery = query.toLowerCase()
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) || 
      task.description.toLowerCase().includes(lowerQuery)
    )
  },

  async moveToProject(taskId, newProjectId) {
    await delay()
    const index = tasks.findIndex(t => t.Id === parseInt(taskId))
    if (index === -1) {
      throw new Error("Task not found")
    }
    tasks[index].projectId = parseInt(newProjectId)
    return { ...tasks[index] }
  }
}