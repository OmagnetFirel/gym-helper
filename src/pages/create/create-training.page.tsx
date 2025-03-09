import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useTraining } from '@/hooks/useTraining';
import { CreateTrainingData, ExerciseFormData } from '@/types/training';
import { APP_CONFIG } from '@/constants/config';

interface TrainingFormData {
    name: string;
    notes?: string;
    exercises: ExerciseFormData[];
}

const CreateTrainingPage: React.FC = () => {
    const navigate = useNavigate();
    const { createTraining, loading, error } = useTraining();
    const {
        register,
        handleSubmit,
    } = useForm<TrainingFormData>();

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const onSubmit: SubmitHandler<TrainingFormData> = async (data) => {
        try {
            const updatedExercises = await Promise.all(
                data.exercises.map(async (exercise) => {
                    const base64Images = await Promise.all(
                        Array.from(exercise.image).map((file) => convertImageToBase64(file))
                    );

                    return {
                        id: crypto.randomUUID(),
                        name: exercise.name,
                        type: exercise.type,
                        sets: exercise.numberOfSets,
                        reps: exercise.numberOfRepetitions,
                        weight: exercise.type === 'weight' ? exercise.weight : undefined,
                        time: exercise.type === 'cardio' ? exercise.time : undefined,
                        notes: exercise.observations,
                        images: base64Images,
                    };
                })
            );

            const trainingData: CreateTrainingData = {
                name: data.name,
                date: new Date(),
                exercises: updatedExercises,
                notes: data.notes,
            };

            await createTraining(trainingData);
            navigate(APP_CONFIG.ROUTES.LIST);
        } catch (err) {
            console.error('Error creating training:', err);
        }
    };

    const [exercises, setExercises] = useState([
        {
            name: '',
            type: 'weight' as const,
            numberOfSets: 1,
            numberOfRepetitions: 1,
            weight: 0,
            time: 0,
            restTime: 0,
            observations: '',
            image: null as FileList | null,
        },
    ]);

    const addExercise = () => {
        setExercises([
            ...exercises,
            {
                name: '',
                type: 'weight' as const,
                numberOfSets: 1,
                numberOfRepetitions: 1,
                weight: 0,
                time: 0,
                restTime: 0,
                observations: '',
                image: null,
            },
        ]);
    };

    const updateExercise = (index: number, field: string, value: unknown) => {
        const updatedExercises = [...exercises];
        updatedExercises[index] = {
            ...updatedExercises[index],
            [field]: value,
        };
        setExercises(updatedExercises);
    };

    const removeExercise = (index: number) => {
        const updatedExercises = exercises.filter((_, i) => i !== index);
        setExercises(updatedExercises);
    };

    if (loading) {
        return <div className="p-4 text-foreground">Salvando...</div>;
    }

    if (error) {
        return <div className="p-4 text-destructive">Erro ao salvar treino: {error}</div>;
    }

    return (
        <div className="container py-6">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">Criar Novo Treino</h1>
                    <Button 
                        variant="outline"
                        onClick={() => navigate(APP_CONFIG.ROUTES.LIST)}
                    >
                        Voltar
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="name" className="text-foreground">Nome do Treino</Label>
                            <Input
                                id="name"
                                {...register('name', { required: true })}
                                placeholder="Nome do Treino"
                                className="text-foreground"
                            />
                        </div>

                        <div>
                            <Label htmlFor="notes" className="text-foreground">Observações</Label>
                            <Textarea
                                id="notes"
                                {...register('notes')}
                                placeholder="Observações sobre o treino"
                                className="text-foreground"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-foreground">Exercícios</h2>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addExercise}
                            >
                                Adicionar Exercício
                            </Button>
                        </div>

                        {exercises.map((exercise, index) => (
                            <div key={index} className="border p-4 rounded-lg bg-card">
                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor={`name-${index}`} className="text-foreground">Nome do Exercício</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => removeExercise(index)}
                                            className="text-destructive hover:text-destructive/90"
                                        >
                                            Remover
                                        </Button>
                                    </div>

                                    <Input
                                        id={`name-${index}`}
                                        {...register(`exercises.${index}.name`, { required: true })}
                                        placeholder="Nome do Exercício"
                                        className="text-foreground"
                                    />

                                    <div>
                                        <Label htmlFor={`type-${index}`} className="text-foreground">Tipo de Exercício</Label>
                                        <select
                                            id={`type-${index}`}
                                            {...register(`exercises.${index}.type`, { required: true })}
                                            value={exercise.type}
                                            onChange={(e) => updateExercise(index, 'type', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="weight">Musculação</option>
                                            <option value="cardio">Cardio</option>
                                        </select>
                                    </div>

                                    {exercise.type === 'weight' ? (
                                        <div>
                                            <Label htmlFor={`weight-${index}`} className="text-foreground">Peso (kg)</Label>
                                            <Input
                                                id={`weight-${index}`}
                                                type="number"
                                                {...register(`exercises.${index}.weight`)}
                                                placeholder="Peso (kg)"
                                                className="text-foreground"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <Label htmlFor={`time-${index}`} className="text-foreground">Tempo (minutos)</Label>
                                            <Input
                                                id={`time-${index}`}
                                                type="number"
                                                {...register(`exercises.${index}.time`)}
                                                placeholder="Tempo (minutos)"
                                                className="text-foreground"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor={`sets-${index}`} className="text-foreground">Número de Séries</Label>
                                        <Input
                                            id={`sets-${index}`}
                                            type="number"
                                            {...register(`exercises.${index}.numberOfSets`, { required: true })}
                                            placeholder="Número de Séries"
                                            className="text-foreground"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`reps-${index}`} className="text-foreground">Repetições por Série</Label>
                                        <Input
                                            id={`reps-${index}`}
                                            type="number"
                                            {...register(`exercises.${index}.numberOfRepetitions`, { required: true })}
                                            placeholder="Repetições por Série"
                                            className="text-foreground"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`notes-${index}`} className="text-foreground">Observações</Label>
                                        <Textarea
                                            id={`notes-${index}`}
                                            {...register(`exercises.${index}.observations`)}
                                            placeholder="Observações do exercício"
                                            className="text-foreground"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">
                            Criar Treino
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTrainingPage;