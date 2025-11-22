"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { ProjectDialog } from "./project-dialog"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: string
  title: string
  description: string
  tech_stack: string[]
  image_url: string | null
  project_url: string | null
  github_url: string | null
  order_index: number
  is_visible: boolean
}

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const fetchProjects = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("projects").select("*").order("order_index", { ascending: true })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      })
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingProject(null)
    setDialogOpen(true)
  }

  const handleToggleVisibility = async (project: Project) => {
    const { error } = await supabase.from("projects").update({ is_visible: !project.is_visible }).eq("id", project.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Project visibility updated",
      })
      fetchProjects()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Project deleted",
      })
      fetchProjects()
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Projects</h2>
        <Button onClick={handleAdd} className="cosmic-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="glass-panel">
            <CardHeader>
              <CardTitle className="text-foreground">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleToggleVisibility(project)}>
                  {project.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
        onSuccess={fetchProjects}
      />
    </div>
  )
}
