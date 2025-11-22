"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ContentDialog } from "./content-dialog"

type PortfolioContent = {
  id: string
  section: string
  title: string
  content: any
  order_index: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export function ContentManager() {
  const [contents, setContents] = useState<PortfolioContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<PortfolioContent | null>(null)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("portfolio_content")
        .select("*")
        .order("order_index", { ascending: true })

      if (error) throw error
      setContents(data || [])
    } catch (error) {
      console.error("Error fetching content:", error)
      toast({
        title: "Error",
        description: "Failed to load portfolio content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase.from("portfolio_content").update({ is_visible: !currentVisibility }).eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Content ${!currentVisibility ? "shown" : "hidden"}`,
      })
      fetchContents()
    } catch (error) {
      console.error("Error toggling visibility:", error)
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return

    try {
      const { error } = await supabase.from("portfolio_content").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Content deleted successfully",
      })
      fetchContents()
    } catch (error) {
      console.error("Error deleting content:", error)
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (content: PortfolioContent) => {
    setEditingContent(content)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingContent(null)
    setDialogOpen(true)
  }

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading content...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Portfolio Content</h2>
          <p className="text-muted-foreground">Manage your About, Contact, and other portfolio sections</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Content
        </Button>
      </div>

      <div className="grid gap-4">
        {contents.map((content) => (
          <Card key={content.id} className="glass-panel">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-foreground">{content.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Section: {content.section}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => toggleVisibility(content.id, content.is_visible)}>
                    {content.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(content)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(content.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(content.content, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}

        {contents.length === 0 && (
          <Card className="glass-panel">
            <CardContent className="py-12 text-center text-muted-foreground">
              No content yet. Click "Add Content" to create your first entry.
            </CardContent>
          </Card>
        )}
      </div>

      <ContentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        content={editingContent}
        onSuccess={fetchContents}
      />
    </div>
  )
}
