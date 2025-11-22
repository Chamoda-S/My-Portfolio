"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { SkillDialog } from "./skill-dialog"
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

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const fetchSkills = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("skills").select("*").order("order_index", { ascending: true })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      })
    } else {
      setSkills(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingSkill(null)
    setDialogOpen(true)
  }

  const handleToggleVisibility = async (skill: Skill) => {
    const { error } = await supabase.from("skills").update({ is_visible: !skill.is_visible }).eq("id", skill.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Skill visibility updated",
      })
      fetchSkills()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    const { error } = await supabase.from("skills").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Skill deleted",
      })
      fetchSkills()
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading skills...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Skills</h2>
        <Button onClick={handleAdd} className="cosmic-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill) => (
          <Card key={skill.id} className="glass-panel">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">{skill.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{skill.category}</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{skill.proficiency}%</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(skill)}>
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleToggleVisibility(skill)}>
                  {skill.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(skill.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SkillDialog open={dialogOpen} onOpenChange={setDialogOpen} skill={editingSkill} onSuccess={fetchSkills} />
    </div>
  )
}
