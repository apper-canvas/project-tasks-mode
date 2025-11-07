import projectsData from "@/services/mockData/projects.json"

let projects = [...projectsData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const projectService = {
  async getAll() {
    await delay()
    return projects.filter(project => !project.isArchived)
  },

  async getById(id) {
    await delay()
    const project = projects.find(p => p.Id === parseInt(id))
    if (!project) {
      throw new Error("Project not found")
    }
    return { ...project }
  },

  async create(projectData) {
    await delay()
    const maxId = Math.max(...projects.map(p => p.Id), 0)
    const newProject = {
      Id: maxId + 1,
      name: projectData.name,
      color: projectData.color,
      createdAt: new Date().toISOString(),
      isArchived: false
    }
    projects.push(newProject)
    return { ...newProject }
  },

  async update(id, projectData) {
    await delay()
    const index = projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Project not found")
    }
    projects[index] = {
      ...projects[index],
      ...projectData
    }
    return { ...projects[index] }
  },

  async delete(id) {
    await delay()
    const index = projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Project not found")
    }
    projects.splice(index, 1)
    return true
  },

  async archive(id) {
    await delay()
    const index = projects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Project not found")
    }
    projects[index].isArchived = true
    return { ...projects[index] }
  }
}