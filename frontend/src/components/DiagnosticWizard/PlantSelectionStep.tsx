'use client';

import { useCallback, useState } from "react";
import React from "react";
import { Plant, PlantSelectorProps } from "@/types/types";

const PlantSelectionStep: React.FC<PlantSelectorProps> = ({
	plants,
	selectedPlant,
	onPlantSelect,
	loading,
	error
}) => {
	if (loading) {
		return LoadingUI('Loading plants...');
	}

	if (error) {
		return ErrorUI(error);
	}

	return (
		<div className="space-y-4">
			<div className="text-center">
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">
					Select Your Plant
				</h2>
				<p className="text-gray-600">
					Choose the plant you'd like to diagnose from the list below.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{plants.map((plant) => (
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
				))}
			</div>
		</div>
	);
}
