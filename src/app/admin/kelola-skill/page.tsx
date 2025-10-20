import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SkillsDataTable } from "@/components/skills-data-table"
import { getSkills } from "@/lib/skills"

export const dynamic = 'force-dynamic'

export default async function KelolaSkillPage() {
  const skills = await getSkills();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="@container/main flex flex-1 flex-col gap-6 p-6">
          <SkillsDataTable data={skills} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}