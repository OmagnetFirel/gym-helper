import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { ModeToggle } from "@/components/header/ModeToggle";
import icon from "../../assets/icon-gym.png"
export function Header() {
  return (
    <section className=" shadow-md dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 p-4">
      <Menubar>
      <img src={icon} alt="teste" className="h-12 w-12 text-center mx-auto" />
        <MenubarMenu>
          <SidebarTrigger />

          <MenubarTrigger onClick={() => (window.location.href = "/cadastro")}>
            Cadastrar Treino
          </MenubarTrigger>

          <MenubarTrigger onClick={() => (window.location.href = "/listar")}>
            Listar Treinos
          </MenubarTrigger>

          <ModeToggle />
        </MenubarMenu>
      </Menubar>
    </section>
  );
}
