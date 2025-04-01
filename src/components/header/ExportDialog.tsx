import React, {useEffect} from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import * as XLSX from 'xlsx';
import {useTraining} from "@/hooks/useTraining.ts";



const ExportDialog: React.FC = () => {
    const { fetchTrainings, trainings } = useTraining();

    useEffect(() => {
         fetchTrainings();
    }, [fetchTrainings]);


    const exportToCSV = () => {
        // Convert trainings to CSV format
        const csvContent = trainings.map(training => {
            const exercises = training.exercises.map(ex => {
                const reps = ex.type === 'cardio' 
                    ? `${ex.time}min` 
                    : `${ex.sets}X${ex.reps}`;
                return `${ex.name} (${reps})`;
            }).join('; ');
            
            return {
                'Nome do Treino': training.name,
                'Data': new Date(training.date).toLocaleDateString(),
                'Exercícios': exercises
            };
        });

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(csvContent);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Treinos");

        // Save file
        XLSX.writeFile(wb, "treinos.xlsx");
    };

    const exportToJSON = () => {
        const jsonString = JSON.stringify(trainings, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'treinos.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="flex items-center gap-2 text-foreground hover:text-foreground/80" title="Exportar Treinos">
                    <Download className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-foreground">Exportar Treinos</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Escolha o formato para exportar seus treinos.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Button 
                        variant="outline" 
                        className="flex items-center gap-2 text-foreground hover:text-foreground/80"
                        onClick={exportToCSV}
                    >
                        Exportar como Excel
                    </Button>
                    <Button 
                        variant="outline" 
                        className="flex items-center gap-2 text-foreground hover:text-foreground/80"
                        onClick={exportToJSON}
                    >
                        Exportar como JSON
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ExportDialog; 