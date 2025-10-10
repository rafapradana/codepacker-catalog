import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StudentsDataTable } from "@/components/students-data-table"
import { getStudentsWithRelations } from "@/lib/students-with-relations"
import { getSkills } from "@/lib/skills"
import { getClasses } from "@/lib/classes"

export default async function StudentManagementPage() {
  const [students, skills, classes] = await Promise.all([
    getStudentsWithRelations(),
    getSkills(),
    getClasses(),
  ])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <StudentsDataTable data={students} skills={skills} classes={classes} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}