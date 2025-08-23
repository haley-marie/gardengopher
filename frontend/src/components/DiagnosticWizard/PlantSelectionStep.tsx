'use client';

import React from "react";
import { PlantSelectorProps } from "@/types/types";
import PlantSelectButton from "./PlantSelectButton";

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
				{plants.map((plant) => PlantSelectButton(plant, onPlantSelect, selectedPlant))};
			</div>
		</div>
	);
}

export default PlantSelectionStep;
