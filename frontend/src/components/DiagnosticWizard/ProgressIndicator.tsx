'use client'

import { WizardStep } from "@/types/types"
import { useState } from "react";


const ProgressIndicator = () => {
	const [currentStep, _] = useState<WizardStep>(WizardStep.PLANT_SELECTION);
	const wizardSteps = Object.values(WizardStep).slice(0, 3);

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between">
				{wizardSteps.map((step, index) => (
					<div
						key={index}
						className={`flex items-center ${index < wizardSteps.length - 1 ? 'flex-1' : ''}`}
					>
						<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                					${currentStep === step
								? 'bg-green-600 text-white'
								: wizardSteps.indexOf(currentStep) > index
									? 'bg-green-200 text-green-800'
									: 'bg-gray-200 text-gray-600'
							}
						`}>
							{index + 1}
						</div>

						{index < wizardSteps.length - 1 && (
							<div className={`flex-1 h-0.5 mx-4 ${wizardSteps.indexOf(currentStep) > index
								? 'bg-green-200'
								: 'bg-gray-200'
								}`} />
						)}
					</div>
				))}
			</div>

			<div className="flex justify-between mt-2">
				<span className="text-xs text-gray-600">Select Plant</span>
				<span className="text-xs text-gray-600">Choose Symptoms</span>
				<span className="text-xs text-gray-600">View Results</span>
			</div>
		</div>
	)
}

export default ProgressIndicator;
