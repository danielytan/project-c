import { docsConfig } from "./config/docs"
import { DocsSidebarNav } from "@/components/sidebar-nav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from '@/components/ui/button';
import { ChevronsDown, PlusCircle } from "lucide-react"
import { CollapsibleDemo } from "./components/collapsible-demo";

import { Calendar } from "@/components/ui/calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="border-b">
      <div className="px-4 md:px-8 lg:px-12 flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pl-0 pr-0 lg:py-8">
            <Button variant="outline" className="shadow-lg w-3/4 h-12">
              <PlusCircle className="mr-2 h-5 w-5" /> 追加
            </Button>
            <Calendar mode="single" className="scale-90 origin-top-left px-0 pt-7 pb-0" />
            <CollapsibleDemo />
          </ScrollArea>
        </aside>
        {children}
      </div>
    </div>
  )
}