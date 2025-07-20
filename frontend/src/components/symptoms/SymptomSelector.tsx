import React from "react";
import { Leaf, Eye, AlertCircle, CheckCircle } from 'lucide-react';

interface Symptom {
	id: string;
	description: string;
	category: string;
}

interface Plant {
	id: number;
	name: string;
	display_name: string;
}

interface SymptomSelectorProps {
	symptoms: Symptom[];
	selectedSymptoms: Set<string>;
	onSymptomToggle: (symptomId: string) => void;
	selectedPlant?: Plant | null;
	loading?: boolean;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({
	symptoms,
	selectedSymptoms,
	onSymptomToggle,
	selectedPlant,
	loading = false
}) => {
	const symptomCategories = [
		{
			id: 'leaf_color',
			title: 'Leaf Color Changes',
			description: 'Changes in leaf color patterns',
			icon: <Leaf className="w-5 h-5" />
		},
		{
			id: 'leaf_physical',
			title: 'Leaf Shape & Texture',
			description: 'Physical changes to leaf structure',
			icon: <Eye className="w-5 h-5" />
		},
		{
			id: 'plant_health',
			title: 'Overall Plant Health',
			description: 'General growth and vitality issues',
			icon: <AlertCircle className="w-5 h-5" />
		},
		{
			id: 'reproductive',
			title: 'Flowering & Fruiting',
			description: 'Issues with flowers and fruit development',
			icon: <CheckCircle className="w-5 h-5" />
		}
	];

	if (loading) {
		return (
			<div className="flex justify-center items-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-xl font-semibold mb-2">What symptoms do you observe?</h2>
				{selectedPlant && (
					<p className="text-gray-600">
						Select all symptoms you notice on your {selectedPlant.display_name}
					</p>
				)}
			</div>

			{symptomCategories.map(category => {
				const categorySymptoms = symptoms.filter(s => s.category === category.id);
				if (categorySymptoms.length === 0) return null;

				return (
					<div key={category.id} className="border rounded-lg p-4">
						<div className="flex items-center mb-3">
							{category.icon}
							<h3 className="ml-2 font-semibold">{category.title}</h3>
						</div>
						<p className="text-sm text-gray-600 mb-3">{category.description}</p>

						<div className="space-y-2">
							{categorySymptoms.map(symptom => (
								<label
									key={symptom.id}
									className={`flex items-start p-3 rounded-md border cursor-pointer transition-colors ${selectedSymptoms.has(symptom.id)
										? 'bg-blue-50 border-blue-200'
										: 'border-gray-200 hover:bg-gray-50'
										}`}
								>
									<input
										type="checkbox"
										checked={selectedSymptoms.has(symptom.id)}
										onChange={() => onSymptomToggle(symptom.id)}
										className="mt-1 mr-3 text-blue-500"
									/>
									<span className="text-sm">{symptom.description}</span>
								</label>
							))}
						</div>
					</div>
				);
			})}

			{
				selectedSymptoms.size > 0 && (
					<div className="bg-green-50 border border-green-200 rounded-lg p-4">
						<h4 className="font-semibold text-green-800 mb-2">
							Selected Symptoms ({selectedSymptoms.size})
						</h4>
						<div className="text-sm text-green-700">
							{Array.from(selectedSymptoms).map(symptomId => {
								const symptom = symptoms.find(s => s.id === symptomId);
								return symptom ? symptom.description : symptomId;
							}).join(', ')}
						</div>
					</div>
				)
			}
		</div>
	);
};

export default SymptomSelector;
