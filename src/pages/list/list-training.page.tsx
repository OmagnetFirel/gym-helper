import React, { useEffect, useState } from "react";
import { BicepsFlexed, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { useTraining } from "@/hooks/useTraining";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/constants/config";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ListTrainingPage: React.FC = () => {
    const { trainings, loading, error, fetchTrainings, deleteTraining } = useTraining();
    const navigate = useNavigate();
    const [selectedTrainings, setSelectedTrainings] = useState<string[]>([]);

    useEffect(() => {
        fetchTrainings();
    }, [fetchTrainings]);

    const handleDeleteTraining = async (trainingId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteTraining(trainingId);
            await fetchTrainings();
            setSelectedTrainings([]); // Limpa seleções após deletar
        } catch (err) {
            console.error('Error deleting training:', err);
        }
    };

    const handleDeleteSelected = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            for (const trainingId of selectedTrainings) {
                await deleteTraining(trainingId);
            }
            await fetchTrainings();
            setSelectedTrainings([]); // Limpa seleções após deletar
        } catch (err) {
            console.error('Error deleting trainings:', err);
        }
    };

    const toggleTrainingSelection = (trainingId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedTrainings(current => 
            current.includes(trainingId)
                ? current.filter(id => id !== trainingId)
                : [...current, trainingId]
        );
    };

    const toggleSelectAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedTrainings(current => 
            current.length === trainings.length
                ? []
                : trainings.map(t => t.id)
        );
    };

    if (loading) {
        return <div className="p-4">Carregando...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Erro ao carregar treinos: {error}</div>;
    }

    return (
        <div className="container py-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">Meus Treinos</h1>
                    {loading ? (
                        <div className="text-muted-foreground">Carregando...</div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Checkbox 
                                    className="text-xs"
                                    checked={selectedTrainings.length === trainings.length}
                                    onClick={toggleSelectAll}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {selectedTrainings.length}
                                </span>
                            </div>
                            {selectedTrainings.length > 0 && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button 
                                            variant="destructive"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <Trash2 className="h-4 w-4 text-xs" />
                                            Remover Selecionados
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Remover Treinos</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Tem certeza que deseja remover {selectedTrainings.length} treino(s)? Esta ação não pode ser desfeita.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={handleDeleteSelected}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Remover
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    )}
                </div>
                <ul className="space-y-2">
                    {trainings.map((training) => (
                        <li
                            key={training.id}
                            className="border rounded-lg shadow-sm"
                        >
                            <div
                                className={clsx(
                                    "flex items-center gap-4 p-4",
                                    "transition-all duration-200 cursor-pointer",
                                    "hover:bg-accent hover:text-accent-foreground"
                                )}
                                onClick={() => navigate(APP_CONFIG.ROUTES.TRAINING.replace(':id', training.id))}
                            >
                                <Checkbox 
                                    className="text-xs"
                                    checked={selectedTrainings.includes(training.id)}
                                    onClick={(e) => toggleTrainingSelection(training.id, e)}
                                />
                                <div className="text-lg font-medium text-foreground">
                                    {new Date(training.date).toLocaleDateString()}
                                </div>
                                <div className="text-xl flex-grow text-foreground">{training.name}</div>
                                <div className="flex items-center gap-2">
                                    <BicepsFlexed className="text-muted-foreground" />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="text-destructive hover:text-destructive/90"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Remover Treino</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tem certeza que deseja remover este treino? Esta ação não pode ser desfeita.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction 
                                                    onClick={(e) => handleDeleteTraining(training.id, e)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Remover
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ListTrainingPage;