"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectsManager } from "./projects-manager"
import { SkillsManager } from "./skills-manager"
import { ContentManager } from "./content-manager"

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Admin Dashboard</h1>
        <p className="text-muted-foreground text-pretty">Manage your portfolio content, projects, and skills</p>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="glass-panel">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          <ProjectsManager />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsManager />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <ContentManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
