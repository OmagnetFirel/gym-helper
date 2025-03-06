import React from 'react';
import { Linkedin, Github } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const Footer: React.FC = () => {
    return (
        <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex flex-col h-14 items-center gap-2 justify-center">
                <p className="text-sm text-muted-foreground">
                    © 2024 Gym Helper. Todos os direitos reservados.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <a
                        href="https://www.linkedin.com/in/victor-mouza/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Badge variant="secondary" className="flex items-center gap-2 hover:bg-secondary/80">
                            <Linkedin className="h-4 w-4" />
                            <span>LinkedIn</span>
                        </Badge>
                    </a>
                    <a
                        href="https://github.com/OmagnetFirel"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Badge variant="secondary" className="flex items-center gap-2 hover:bg-secondary/80">
                            <Github className="h-4 w-4" />
                            <span>GitHub</span>
                        </Badge>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 