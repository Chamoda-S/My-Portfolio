"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon: string | null
  order_index: number
  is_visible: boolean
}

interface SkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skill: Skill | null
  onSuccess: () => void
}

export function SkillDialog({ open, onOpenChange, skill, onSuccess }: SkillDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    proficiency: 50,
    order_index: 0,
  })
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        order_index: skill.order_index,
      })
    } else {
      setFormData({
        name: "",
        category: "",
        proficiency: 50,
        order_index: 0,
      })
    }
  }, [skill])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let error
    if (skill) {
      const result = await supabase.from("skills").update(formData).eq("id", skill.id)
      error = result.error
    } else {
      const result = await supabase.from("skills").insert([formData])
      error = result.error
    }

    setLoading(false)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save skill",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: `Skill ${skill ? "updated" : "created"}`,
      })
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle className="text-foreground">{skill ? "Edit Skill" : "Add Skill"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency: {formData.proficiency}%</Label>
            <Input
              id="proficiency"
              type="range"
              min="0"
              max="100"
              value={formData.proficiency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  proficiency: Number.parseInt(e.target.value),
                })
              }
            />
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
