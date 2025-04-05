import React, {useState} from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {useTraining} from "@/hooks/useTraining.ts";
import {Training} from "@/types/training.ts";
import * as XLSX from "xlsx";
import {APP_CONFIG} from "@/constants/config.ts";
import {Input} from "@/components/ui/input";
import {useNavigate} from "react-router-dom";

interface ExcelRow {
    [key: string]: string | number;
}

const ImportDialog:React.FC = () => {
    const { createTraining } = useTraining();
    const [cFile, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

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
                const isCardio = exerciseName.toLowerCase().includes('cardio');
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

    const handleCSV = async(file:File) =>{
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

            navigate(APP_CONFIG.ROUTES.LIST);
        } catch (error) {
            console.error('Error processing excel file:', error);
        }
    }

    const handleJson = async(file:File) =>{
        try {
            const data = await file.text();
            const trainings = JSON.parse(data) as Partial<Training>[];

            for (const training of trainings) {
                if (training.name && training.exercises) {
                    await createTraining(training as Training);
                }
            }

            navigate(APP_CONFIG.ROUTES.LIST);
        } catch (error) {
            console.error('Error processing JSON file:', error);
        }
    }

    const handleFileUpload = async () => {
        if (!cFile) return;
        const fileExtension = cFile.name.split('.').pop()?.toLowerCase();
        if(fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'csv') {
            await handleCSV(cFile);
        }else {
            await handleJson(cFile);
        }
        setFile(null);
        navigate(APP_CONFIG.ROUTES.LIST, { replace: true });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="flex items-center gap-2 text-foreground hover:text-foreground/80" title="Importar Treinos">
                    <Upload className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-foreground">Importar Treinos</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Importe seu treino a partir de uma planilha ou de um arquivo JSON.
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
                    <div className="grid gap-4 py-4">
                        <Input
                            type="file"
                            accept=".xlsx,.xls ,.csv,.json, .txt"
                            onChange={handleFileChange}
                            className="text-foreground"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        className="text-foreground hover:text-foreground/80"
                        onClick={handleFileUpload}
                        disabled={!cFile}
                    >
                        Importar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImportDialog