import React from 'react';
import { Button } from "@/components/ui/button";
import {  Plus, List } from "lucide-react";

import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '@/constants/config';
import { ModeToggle } from './ModeToggle';
import ExportDialog from './ExportDialog';
import ImportDialog from './ImportDialog';



const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50  max-w-lg mx-auto border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center space-x-2 justify-between">
                    <ImportDialog />
                    <Button
                        variant="outline" 
                        className="flex items-center gap-2 text-foreground hover:text-foreground/80"
                        onClick={() => navigate(APP_CONFIG.ROUTES.CREATE)}
                    >
                        <Plus className="h-4 w-4" />
                        Cadastrar
                    </Button>
                    <Button 
                        variant="outline" 
                        className="flex items-center gap-2 text-foreground hover:text-foreground/80"
                        onClick={() => navigate(APP_CONFIG.ROUTES.LIST)}
                    >
                        <List className="h-4 w-4" />
                        Listar Treinos
                    </Button>
                    <ExportDialog />
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;

