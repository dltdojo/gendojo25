import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import Link from "next/link"

export function AppMenuBar(){
    return <Menubar>
    <MenubarMenu>
      <MenubarTrigger>App</MenubarTrigger>
      <MenubarContent>
      <MenubarItem>
        <Link href="/">HOME</Link>
        </MenubarItem>
        <MenubarItem>
        <Link href="/todos">TODO</Link>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem><Link href="/share">Share</Link></MenubarItem>
        <MenubarSeparator />
        <MenubarItem><Link href="/about">About</Link></MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
}