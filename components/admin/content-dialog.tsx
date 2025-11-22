"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

type PortfolioContent = {
  id: string
  section: string
  title: string
  content: any
  order_index: number
  is_visible: boolean
}

type ContentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: PortfolioContent | null
  onSuccess: () => void
}

export function ContentDialog({ open, onOpenChange, content, onSuccess }: ContentDialogProps) {
  const [title, setTitle] = useState("")
  const [section, setSection] = useState("about")
  const [contentData, setContentData] = useState("")
  const [orderIndex, setOrderIndex] = useState("0")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const supabase = createBrowserClient()

  useEffect(() => {
    if (content) {
      setTitle(content.title)
      setSection(content.section)
      setContentData(JSON.stringify(content.content, null, 2))
      setOrderIndex(content.order_index.toString())
    } else {
      setTitle("")
      setSection("about")
      setContentData("{}")
      setOrderIndex("0")
    }
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Parse JSON content
      let parsedContent
      try {
        parsedContent = JSON.parse(contentData)
      } catch {
        throw new Error("Invalid JSON format in content field")
      }

      const payload = {
        title,
        section,
        content: parsedContent,
        order_index: Number.parseInt(orderIndex),
        is_visible: true,
      }

      if (content) {
        // Update existing
        const { error } = await supabase.from("portfolio_content").update(payload).eq("id", content.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Content updated successfully",
        })
      } else {
        // Create new
        const { error } = await supabase.from("portfolio_content").insert(payload)

        if (error) throw error

        toast({
          title: "Success",
          description: "Content created successfully",
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save content",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel max-w-2xl">
        <DialogHeader>
          <DialogTitle>{content ? "Edit Content" : "Add Content"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Content title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="about">About</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (JSON)</Label>
            <Textarea
              id="content"
              value={contentData}
              onChange={(e) => setContentData(e.target.value)}
              placeholder='{"text": "Your content here"}'
              rows={8}
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">Enter valid JSON format</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order Index</Label>
            <Input
              id="order"
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(e.target.value)}
              placeholder="0"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : content ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
