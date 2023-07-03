"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/bcp"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/bcp" ? "text-foreground" : "text-foreground/60"
          )}
        >
          BCP
        </Link>
        <Link
          href="/chronology"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/chronology")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Chronology
        </Link>
        <Link
          href="/console"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/console")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Console
        </Link>
        <Link
          href={siteConfig.links.github}
          className={cn(
            "hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block"
          )}
        >
          GitHub
        </Link>
      </nav>
    </div>
  )
}