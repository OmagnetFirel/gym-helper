
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';

interface TrainingSetFormData {
    groupName: string;
    groupReference: string;
    exercises: Exercise[];
}

interface Exercise {
    name: string;
    numberOfSets: number;
    numberOfRepetitions: number;
    weight: number;
    restTime: number;
    observations: string;
    example: string;
    image: FileList;
}




const CreateTrainingSetPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<TrainingSetFormData>();

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const onSubmit: SubmitHandler<TrainingSetFormData> = async (data) => {

        const existingData = localStorage.getItem('trainingData');
        const parsedData = existingData ? JSON.parse(existingData) : {};

        const updatedExercises = await Promise.all(
            data.exercises.map(async (exercise) => {
                const base64Images = await Promise.all(
                    Array.from(exercise.image).map((file) => convertImageToBase64(file))
                );

                return {
                    name: exercise.name,
                    example: exercise.example,
                    numberOfSets: exercise.numberOfSets,
                    numberOfRepetitions: exercise.numberOfRepetitions,
                    weight: exercise.weight,
                    restTime: exercise.restTime,
                    observations: exercise.observations,
                    image: base64Images, // Resultado das imagens convertidas
                };
            })
        );

        const updatedData = {
            ...parsedData,
            [data.groupReference]: {
                groupName: data.groupName,
                groupReference: data.groupReference,
                exercises: updatedExercises,
            },
        };
        console.log(updatedData);
        localStorage.setItem('trainingData', JSON.stringify(updatedData));

    };


    const [exercises, setExercises] = React.useState([
        {
            name: '',
            example: null,
            numberOfSets: 1,
            numberOfRepetitions: 1,
            weight: 0,
            restTime: 0,
            observations: '',
        },
    ]);

    const addExercise = () => {
        setExercises([
            ...exercises,
            {
                name: '',
                example: null,
                numberOfSets: 1,
                numberOfRepetitions: 1,
                weight: 0,
                restTime: 0,
                observations: '',
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

    return (
        <div className="max-w-lg mx-auto mt-10">
            <h1 className="text-xl font-bold mb-6">Create New Training Set</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Group Name */}
                <div>
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                        id="groupName"
                        {...register('groupName', {required: true})}
                        placeholder="Enter group name"
                    />
                    {errors.groupName && (
                        <p className="text-red-500 text-sm">Group name is required.</p>
                    )}
                </div>

                {/* Group Reference */}
                <div>
                    <Label htmlFor="groupReference">Group Reference</Label>
                    <Input
                        id="groupReference"
                        {...register('groupReference', {required: true, maxLength: 1})}
                        placeholder="Enter a single letter"
                    />
                    {errors.groupReference && (
                        <p className="text-red-500 text-sm">
                            A single letter is required for group reference.
                        </p>
                    )}
                </div>

                <h2 className="text-lg font-bold mt-6">Exercises</h2>
                {exercises.map((exercise, index) => (
                    <div key={index} className="border p-4 rounded mb-4">
                        <h3 className="font-semibold">Exercise {index + 1}</h3>

                        {/* Exercise Name */}
                        <div>
                            <Label htmlFor={`exerciseName-${index}`}>Exercise Name</Label>
                                <Input
                                    id={`exerciseName-${index}`}
                                    value={exercise.name}
                                    {...register(`exercises.${index}.name`, {required: true})}
                                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
                                    placeholder="Exercise Name"
                                />

                        </div>

                        {/* Image Upload */}
                        <div>
                            <Label htmlFor="image">Image Example</Label>
                            <Input
                                id="image"
                                type="file"
                                {...register(`exercises.${index}.image`, {required: true})}
                                accept="image/*"
                            />
                            {errors.exercises?.[index]?.image && (
                                <p className="text-red-500 text-sm">An image is required.</p>
                            )}
                        </div>

                        {/* Number of Sets */}
                        <div>
                            <Label htmlFor={`numberOfSets-${index}`}>Number of Sets</Label>
                            <Input
                                id={`numberOfSets-${index}`}
                                type="number"
                                {...register(`exercises.${index}.numberOfSets`, {required: true})}
                                value={exercise.numberOfSets}
                                onChange={(e) => updateExercise(index, 'numberOfSets', e.target.value)}
                                placeholder="Number of Sets"
                            />

                        </div>

                        {/* Repetitions Per Set */}
                        <div>
                            <Label htmlFor={`numberOfRepetitions-${index}`}>Repetitions Per Set</Label>
                            <Input
                                id={`numberOfRepetitions-${index}`}
                                type="number"
                                value={exercise.numberOfRepetitions}
                                {...register(`exercises.${index}.numberOfRepetitions`, {required: true})}

                                onChange={(e) => updateExercise(index, 'numberOfRepetitions', e.target.value)}
                                placeholder="Repetitions Per Set"
                            />

                        </div>

                        {/* Weight */}
                        <div>
                            <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                            <Input
                                id={`weight-${index}`}
                                type="number"
                                value={exercise.weight}
                                {...register(`exercises.${index}.weight`, {required: true})}

                                onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                                placeholder="Weight (kg)"
                            />

                        </div>

                        {/* Rest Time */}
                        <div>
                            <Label htmlFor={`restTime-${index}`}>Rest Time (seconds)</Label>
                            <Input
                                id={`restTime-${index}`}
                                type="number"
                                value={exercise.restTime}
                                {...register(`exercises.${index}.restTime`, {required: true})}
                                onChange={(e) => updateExercise(index, 'restTime', e.target.value)}
                                placeholder="Rest Time (seconds)"
                            />

                        </div>

                        {/* Observations */}
                        <div>
                            <Label htmlFor={`observations-${index}`}>Observations</Label>
                            <Textarea
                                id={`observations-${index}`}
                                value={exercise.observations}
                                {...register(`exercises.${index}.observations`, {required: false})}
                                onChange={(e) => updateExercise(index, 'observations', e.target.value)}
                                placeholder="Additional observations"
                            />

                        </div>

                        <Button type="button" onClick={() => removeExercise(index)} className="mt-2">
                            Remove Exercise
                        </Button>
                    </div>
                ))}


                <Button type="button" onClick={addExercise} className="w-full">
                    Add Exercise
                </Button>


                {/* Submit Button */}
                <Button type="submit" className="w-full">
                    Create Training Set
                </Button>
            </form>
        </div>
    );
};

export default CreateTrainingSetPage;