'use client'

import { Plant, PlantSelectorProps } from "@/types/types"

const PlantSelectButton = (
	plants: Plant[],
	onPlantSelect: PlantSelectorProps["onPlantSelect"],
	selectedPlant: Plant,
) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{plants.map((plant) => (
				<button
					key={plant.ID}  // Ensure unique key for each button
					onClick={() => onPlantSelect(plant)}
					className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md
            ${selectedPlant?.ID === plant.ID ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}
          `}
				>
					{/* Plant name with capitalization */}
					<div className="font-semibold text-gray-800 capitalize">
						{plant?.Name?.replace('_', ' ') ?? ''}
					</div>

					{/* Scientific name rendering if it exists */}
					{plant.ScientificName && (
						<div className="text-sm text-gray-500 italic mt-1">
							{plant.ScientificName}
						</div>
					)}
				</button>
			))}
		</div>
	);
};

export default PlantSelectButton;

