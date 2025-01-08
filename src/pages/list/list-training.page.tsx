import React from "react";
import { BicepsFlexed} from "lucide-react";
import {clsx} from "clsx";

type TrainingGroup = {
    title: string;
    letter: string;
    icon: React.ReactNode;
};

const trainingGroups: TrainingGroup[] = [
    {title: "Biceps e Peito", letter: "A", icon: <BicepsFlexed />},
    {title: "Panturilha e Gluteos", letter: "B", icon: <BicepsFlexed/>},
    {title: "Costas e ombro", letter: "C", icon: <BicepsFlexed/>},
    {title: "Peito e abdomen", letter: "D", icon: <BicepsFlexed/>},
];


const TrainingGroupsPage: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Training Groups</h1>
            <ul className="space-y-2">
                {trainingGroups.map((group, index) => (
                    <li
                        key={index}
                        className={clsx(
                            "flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:bg-gray-100",
                            "transition-all duration-200"
                        )}
                    >
                        <div className="text-lg font-medium">{group.letter}</div>
                        <div className="text-xl flex-grow">{group.title}</div>
                        <div className="text-gray-500">{group.icon}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrainingGroupsPage;