import { Plant, PlantSelectorProps } from "@/types/types"
const PlantSelectButton = (plant: Plant, onPlantSelect: PlantSelectorProps["onPlantSelect"], selectedPlant: PlantSelectorProps["selectedPlant"]) => {
	return (
		<button
			key={plant.id}
			onClick={() => onPlantSelect(plant)}
			className={
				`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md
             			${selectedPlant.id === plant.id
					? 'border-green-500 bg-green-50 shadow-md'
					: 'border-gray-200 hover:border-gray-300'
				}`
			}
		>
			);
}
