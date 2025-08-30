'use client'

import { Symptom, SymptomSelectorProps } from "@/types/types";

const SymptomSelectButton = (symptom: Symptom, selectedSymptoms: SymptomSelectorProps["selectedSymptoms"], onSymptomToggle: SymptomSelectorProps["onSymptomToggle"]) => {
	return (
		<label
			key={symptom.id}
			className={`
	        		      flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
        			      ${selectedSymptoms.has(symptom.name)
					? 'border-green-500 bg-green-50'
					: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
				}
            		`}
		>
			<input
				type="checkbox"
				checked={selectedSymptoms.has(symptom.name)}
				onChange={() => onSymptomToggle(symptom.name)}
				className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
			/>
			<div className="ml-3">
				<div className="font-medium text-gray-800">
					{symptom.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
				</div>
				<div className="text-sm text-gray-600 mt-1">
					{symptom.description}
				</div>
			</div>
		</label>
	);
};

export default SymptomSelectButton;
