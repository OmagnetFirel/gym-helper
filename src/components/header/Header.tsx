import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Plus, List } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTraining } from '@/hooks/useTraining';
import * as XLSX from 'xlsx';
import { Training } from '@/types/training';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '@/constants/config';
import { ModeToggle } from './ModeToggle';

interface ExcelRow {
    [key: string]: string | number;
}

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { createTraining } = useTraining();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const processExcelData = (data: ExcelRow[]): Partial<Training>[] => {
        let currentTraining: Partial<Training> | null = null;
        const trainings: Partial<Training>[] = [];

        for (const row of data) {
            const keys = Object.keys(row).filter(key => key !== '__rowNum__');
            
            if (keys.length === 0) continue;

            if (keys.length === 1) {
                if (currentTraining) {
                    trainings.push(currentTraining);
                }

                currentTraining = {
                    id: crypto.randomUUID(),
                    name: row[keys[0]] as string,
                    date: new Date(),
                    exercises: []
                };
                continue;
            }

            if (keys.length === 2 && currentTraining) {
                const mainKey = keys.find(key => key !== '__EMPTY') || keys[0];
                const exerciseName = (row[mainKey] as string).replace(/^\d+\)\s*/, '').trim();
                const setsReps = row['__EMPTY'] as string | undefined;

                let sets = 1;
                let reps = 1;
                let isCardio = exerciseName.toLowerCase().includes('cardio');
                let time: number | undefined;

                if (setsReps) {
                    if (setsReps.includes('min')) {
                        // Format: "30 min" or "30min"
                        time = parseInt(setsReps.replace(/[^0-9]/g, ''));
                        sets = 1;
                        reps = 1;
                    } else if (setsReps.includes('X')) {
                        // Format: "4X 12"
                        const [setsStr, repsStr] = setsReps.split('X').map(s => s.trim());
                        sets = parseInt(setsStr);
                        reps = parseInt(repsStr.split(' ')[0]); // Get first number in case of "12 A 15"
                    } else if (setsReps.includes('-')) {
                        // Format: "15 - 12 - 10 - 8 - 6"
                        const progressiveReps = setsReps.split('-').map(s => parseInt(s.trim()));
                        sets = progressiveReps.length;
                        reps = progressiveReps[0];
                    } else if (setsReps.includes('MÁXIMO')) {
                        // Format: "4X MÁXIMO" or "3X 10 + MÁXIMO"
                        const parts = setsReps.split('X');
                        sets = parseInt(parts[0].trim());
                        reps = 12; // Default value for MÁXIMO
                    } else if (setsReps.includes('+')) {
                        // Format: "3 X 12 + 12"
                        const parts = setsReps.split('X');
                        sets = parseInt(parts[0].trim());
                        const repsPart = parts[1].split('+')[0].trim();
                        reps = parseInt(repsPart);
                    }
                }

                currentTraining.exercises?.push({
                    id: crypto.randomUUID(),
                    name: exerciseName,
                    type: isCardio ? 'cardio' : 'weight',
                    sets,
                    reps,
                    weight: isCardio ? undefined : 0,
                    time: isCardio ? time || 30 : undefined, // Default 30 minutes for cardio if not specified
                    notes: setsReps || '',
                    images: []
                });
            }
        }

        if (currentTraining) {
            trainings.push(currentTraining);
        }

        return trainings;
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

            const trainings = processExcelData(jsonData);
            for (const training of trainings) {
                if (training.name && training.exercises) {
                    await createTraining(training as Training);
                }
            }

            setIsModalOpen(false);
            navigate(APP_CONFIG.ROUTES.LIST);
        } catch (error) {
            console.error('Error processing excel file:', error);
        }
    };

    return (
        <header className="sticky top-0 z-50  max-w-lg mx-auto border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center space-x-2 justify-between">
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="flex items-center gap-2 text-foreground hover:text-foreground/80" title="Importar Planilha">
                                <Upload className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-foreground">Importar Planilha de Treinos</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Selecione uma planilha Excel com seus treinos. A planilha deve estar formatada corretamente.
                                </DialogDescription>
                                <div className="mt-2">
                                    <a 
                                        href="/MODELO_TREINO.xlsx" 
                                        download="modelo_treino.xlsx"
                                        className="text-primary hover:text-primary/90 underline"
                                    >
                                        Baixar planilha de exemplo
                                    </a>
                                </div>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileUpload}
                                    className="text-foreground"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
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
                    <ModeToggle />

                </div>
            </div>
        </header>
    );
};

export default Header;

