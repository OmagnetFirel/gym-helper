import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Training, Exercise } from "@/types/training";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTraining } from "@/hooks/useTraining";
import { APP_CONFIG } from "@/constants/config";
import { Trash2, X, Plus } from "lucide-react";
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
import { Label } from "@/components/ui/label";

const TrainingPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getTrainingById, updateTraining, deleteTraining, loading, error } = useTraining();
    const [training, setTraining] = useState<Training | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const exercisesListRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const fetchTraining = async () => {
            if (id) {
                const data = await getTrainingById(id);
                setTraining(data || null);
            }
        };
        fetchTraining();
    }, [id, getTrainingById]);

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scrollToBottom = () => {
        if (exercisesListRef.current) {
            exercisesListRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    const handleEdit = async () => {
        if (training) {
            try {
                await updateTraining(training.id, training);
                setIsEditing(false);
            } catch (err) {
                console.error('Error updating training:', err);
            }
        }
    };

    const handleDeleteTraining = async () => {
        if (training) {
            try {
                await deleteTraining(training.id);
                navigate(APP_CONFIG.ROUTES.LIST);
            } catch (err) {
                console.error('Error deleting training:', err);
            }
        }
    };

    const handleDeleteExercise = (exerciseId: string) => {
        if (training) {
            const updatedExercises = training.exercises.filter(ex => ex.id !== exerciseId);
            setTraining({ ...training, exercises: updatedExercises });
        }
    };

    const handleInputChange = (index: number, field: keyof Exercise, value: string | number) => {
        if (training) {
            const updatedExercises = [...training.exercises];
            updatedExercises[index] = { ...updatedExercises[index], [field]: value };
            setTraining({ ...training, exercises: updatedExercises });
        }
    };

    const handleImageChange = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (training && event.target.files) {
            try {
                const base64Images = await Promise.all(
                    Array.from(event.target.files).map(file => convertImageToBase64(file))
                );
                const updatedExercises = [...training.exercises];
                updatedExercises[index] = {
                    ...updatedExercises[index],
                    images: base64Images
                };
                setTraining({ ...training, exercises: updatedExercises });
            } catch (err) {
                console.error('Error processing images:', err);
            }
        }
    };

    const handleRemoveImage = (exerciseIndex: number, imageIndex: number) => {
        if (training) {
            const updatedExercises = [...training.exercises];
            const exercise = updatedExercises[exerciseIndex];
            if (exercise.images) {
                exercise.images = exercise.images.filter((_, i) => i !== imageIndex);
                setTraining({ ...training, exercises: updatedExercises });
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleStartEditing = () => {
        setIsEditing(true);
        scrollToTop();
    };

    const handleAddExercise = () => {
        if (training) {
            const newExercise: Exercise = {
                id: crypto.randomUUID(),
                name: '',
                type: 'weight',
                sets: 1,
                reps: 1,
                weight: 0,
                notes: '',
                images: []
            };
            setTraining({
                ...training,
                exercises: [...training.exercises, newExercise]
            });
            setIsEditing(true);
            setTimeout(scrollToBottom, 100);
        }
    };

    if (loading) {
        return <div className="p-4">Carregando...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Erro ao carregar treino: {error}</div>;
    }

    if (!training) {
        return <div className="p-4">Treino não encontrado.</div>;
    }

    return (
        <div className="p-4 max-w-lg mx-auto">
                <div className="bg-background border rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{training.name}</h2>
                        <p className="text-muted-foreground">
                            {new Date(training.date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apagar Treino</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tem certeza que deseja apagar este treino? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteTraining} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Apagar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button
                            onClick={() => navigate(APP_CONFIG.ROUTES.LIST)}
                            variant="outline"
                        >
                            Voltar
                        </Button>
                    </div>
                </div>

                {training.notes && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2 text-foreground">Observações:</h3>
                        <p className="text-muted-foreground">{training.notes}</p>
                    </div>
                )}

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-foreground">Exercícios</h3>
                    {isEditing && (
                        <Button
                            onClick={handleAddExercise}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Adicionar Exercício
                        </Button>
                    )}
                </div>

                <ul ref={exercisesListRef} className="space-y-4">
                    {training.exercises.map((exercise, index) => (
                        <li key={exercise.id} className="p-4 bg-card rounded-lg shadow-sm border">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <Label htmlFor={`exercise-name-${index}`}>Nome do Exercício</Label>
                                        <Input
                                            id={`exercise-name-${index}`}
                                            value={exercise.name}
                                            placeholder="Nome do Exercício"
                                            disabled={!isEditing}
                                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    {isEditing && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="icon" className="text-destructive hover:text-destructive/90">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Apagar Exercício</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tem certeza que deseja apagar este exercício? Esta ação não pode ser desfeita.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteExercise(exercise.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        Apagar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`exercise-sets-${index}`}>Número de Séries</Label>
                                        <Input
                                            id={`exercise-sets-${index}`}
                                            type="number"
                                            value={exercise.sets}
                                            placeholder="Séries"
                                            disabled={!isEditing}
                                            onChange={(e) => handleInputChange(index, 'sets', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`exercise-reps-${index}`}>Repetições por Série</Label>
                                        <Input
                                            id={`exercise-reps-${index}`}
                                            type="number"
                                            value={exercise.reps}
                                            placeholder="Repetições"
                                            disabled={!isEditing}
                                            onChange={(e) => handleInputChange(index, 'reps', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <>
                                        <div>
                                            <Label htmlFor={`exercise-type-${index}`}>Tipo de Exercício</Label>
                                            <select
                                                id={`exercise-type-${index}`}
                                                value={exercise.type}
                                                onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="weight">Musculação</option>
                                                <option value="cardio">Cardio</option>
                                            </select>
                                        </div>

                                        {exercise.type === 'weight' ? (
                                            <div>
                                                <Label htmlFor={`exercise-weight-${index}`}>Peso (kg)</Label>
                                                <Input
                                                    id={`exercise-weight-${index}`}
                                                    type="number"
                                                    value={exercise.weight || ''}
                                                    placeholder="Peso (kg)"
                                                    onChange={(e) => handleInputChange(index, 'weight', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <Label htmlFor={`exercise-time-${index}`}>Tempo (minutos)</Label>
                                                <Input
                                                    id={`exercise-time-${index}`}
                                                    type="number"
                                                    value={exercise.time || ''}
                                                    placeholder="Tempo (minutos)"
                                                    onChange={(e) => handleInputChange(index, 'time', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {!isEditing && (
                                    <>
                                        {exercise.type === 'weight' && exercise.weight ? (
                                            <div>
                                                <Label>Peso (kg)</Label>
                                                <Input
                                                    type="number"
                                                    value={exercise.weight}
                                                    disabled
                                                />
                                            </div>
                                        ) : exercise.type === 'cardio' && exercise.time ? (
                                            <div>
                                                <Label>Tempo (minutos)</Label>
                                                <Input
                                                    type="number"
                                                    value={exercise.time}
                                                    disabled
                                                />
                                            </div>
                                        ) : null}
                                    </>
                                )}

                                {isEditing && (
                                    <div>
                                        <Label htmlFor={`exercise-notes-${index}`}>Observações</Label>
                                        <Input
                                            id={`exercise-notes-${index}`}
                                            value={exercise.notes || ''}
                                            placeholder="Observações"
                                            onChange={(e) => handleInputChange(index, 'notes', e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium">Imagens do Exercício</h4>
                                        {isEditing && (
                                            <div className="flex-1 max-w-xs">
                                                <Label htmlFor={`exercise-images-${index}`} className="sr-only">Adicionar Imagens</Label>
                                                <Input
                                                    id={`exercise-images-${index}`}
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => handleImageChange(index, e)}
                                                    className="text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {exercise.images && exercise.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {exercise.images.map((image, imgIndex) => (
                                                <div key={imgIndex} className="relative group flex items-center justify-center w-full">
                                                    <div className="relative w-full aspect-square">
                                                        <img
                                                            src={image}
                                                            alt={`${exercise.name} - Exemplo ${imgIndex + 1}`}
                                                            className="rounded-lg w-full h-full object-cover"
                                                        />
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleRemoveImage(index, imgIndex)}
                                                                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                aria-label="Remover imagem"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="mt-6 flex justify-end gap-2">
                    {isEditing ? (
                        <>
                            <Button
                                variant="destructive"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleEdit}
                            >
                                Salvar
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={handleStartEditing}
                        >
                            Editar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainingPage;