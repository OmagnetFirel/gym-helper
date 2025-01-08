
import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"



import {ModeToggle} from "@/components/header/ModeToggle";

export function Header() {
    return (
        <Menubar >
            <MenubarMenu>
                <SidebarTrigger />
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger onClick={()=> window.location.href = "/cadastro"}>
                        Cadastrar Treino
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger onClick={()=> window.location.href = "/listar"}>
                    Listar Treinos
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <ModeToggle />
            </MenubarMenu>
        </Menubar>
    )
}
