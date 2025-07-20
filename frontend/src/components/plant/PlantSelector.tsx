import React from 'react';
import { Leaf } from 'lucide-react';

interface Plant {
	id: number;
	name: string;
	display_name: string;
}

interface PlantSelectorProps {
	plants: Plant[];
	selectedPlant: Plant | null;
	onPlantSelect: (plant: Plant) => void;
	loading?: boolean;
}

const PlantSelector: React.FC<PlantSelectorProps> = ({
	plants,
	selectedPlant,
	onPlantSelect,
	loading = false
}) => {
	if (loading) {
		return (
			<div className='flex justify-center items-center py-8'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-500'></div>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<h2 className='text-xl font-semibold text-center mb-6'>
				What type of plant are you diagnosing?
			</h2>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{plants.map(plant => (
					<button
						key={plant.id}
						onClick={() => onPlantSelect(plant)}
						className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${selectedPlant?.id === plant.id
							? 'border-green-500 bg-green-50 text-green-700'
							: 'border-gray-200 hover:border-gray-300'
							}`}
					>
						<div className='flex items-center justify-center mb-2'>
							<Leaf className='w-8 h-8 text-green-500' />
						</div>
						<div className='font-medium'>{plant.display_name}</div>
					</button>
				))
				}
			</div >
		</div >
	);
};

export default PlantSelector;
