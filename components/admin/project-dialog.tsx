"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  onSuccess: () => void
}

export function ProjectDialog({ open, onOpenChange, project, onSuccess }: ProjectDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech_stack: "",
    image_url: "",
    project_url: "",
    github_url: "",
    order_index: 0,
  })
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        tech_stack: project.tech_stack.join(", "),
        image_url: project.image_url || "",
        project_url: project.project_url || "",
        github_url: project.github_url || "",
        order_index: project.order_index,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        tech_stack: "",
        image_url: "",
        project_url: "",
        github_url: "",
        order_index: 0,
      })
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const techStackArray = formData.tech_stack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const data = {
      title: formData.title,
      description: formData.description,
      tech_stack: techStackArray,
      image_url: formData.image_url || null,
      project_url: formData.project_url || null,
      github_url: formData.github_url || null,
      order_index: formData.order_index,
    }

    let error
    if (project) {
      const result = await supabase.from("projects").update(data).eq("id", project.id)
      error = result.error
    } else {
      const result = await supabase.from("projects").insert([data])
      error = result.error
    }

    setLoading(false)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: `Project ${project ? "updated" : "created"}`,
      })
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">{project ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
            <Input
              id="tech_stack"
              value={formData.tech_stack}
              onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              placeholder="React, Next.js, TypeScript"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project_url">Project URL</Label>
              <Input
                id="project_url"
                type="url"
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Order Index</Label>
            <Input
              id="order_index"
              type="number"
              value={formData.order_index}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order_index: Number.parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="cosmic-glow">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
