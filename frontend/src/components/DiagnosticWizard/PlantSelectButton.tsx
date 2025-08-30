'use client'

import { Plant, PlantSelectorProps } from "@/types/types"
const PlantSelectButton = (plant: Plant, onPlantSelect: PlantSelectorProps["onPlantSelect"], selectedPlant: PlantSelectorProps["selectedPlant"]) => {
	return (
		<button
			key={plant.id}
			onClick={() => onPlantSelect(plant)}
			className={`
              p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md
              ${selectedPlant?.id === plant.id
					? 'border-green-500 bg-green-50 shadow-md'
					: 'border-gray-200 hover:border-gray-300'
				}
            `}
		>
			<div className="font-semibold text-gray-800 capitalize">
				{plant?.name?.replace('_', ' ') ?? ''}
			</div>
			{plant.scientific_name && (
				<div className="text-sm text-gray-500 italic mt-1">
					{plant.scientific_name}
				</div>
			)}
		</button>
	);
};

export default PlantSelectButton;
