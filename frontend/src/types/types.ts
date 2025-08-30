export interface Plant {
	id: number;
	name: string;
	scientific_name?: string;
	created_at?: string;
	updated_at?: string;
}

export interface PlantSelectorProps {
	plants: Plant[];
	selectedPlant: Plant | null;
	onPlantSelect: (plant: Plant) => void;
	loading?: boolean;
	error: string | null;
}

export interface Symptom {
	id: number;
	name: string;
	description: string;
	created_at?: string;
	updated_at?: string;
}

export interface SymptomSelectorProps {
	symptoms: Symptom[];
	selectedSymptoms: Set<string>;
	onSymptomToggle: (symptomId: string) => void;
	selectedPlant?: Plant | null;
	loading?: boolean;
	error: string | null;
}

export interface Deficiency {
	id: number;
	name: string;
	description: string;
	treatment: string;
	created_at?: string;
	updated_at?: string;
}

export interface SymptomDeficiencyRelation {
	symptom_id: number;
	deficiency_id: number;
	confidence_score: number;
}

export interface DiagnosticRule {
	id: number;
	plant_id: number | null;
	conditions_json: {
		required_symptoms: string[];
		optional_symptoms?: string[];
		min_symptoms: number;
		plant_specific: boolean;
	};
	deficiency_id: number;
	created_at?: string;
	updated_at?: string;
}

export interface DiagnosisRequest {
	plant_id: number;
	symptoms: string[];
}

export interface DiagnosisResult {
	deficiency_id: number;
	deficiency_name: string;
	description: string;
	treatment: string;
	confidence: number;
	matched_symptoms: string[];
}

export interface DiagnosisResultProps {
	results: DiagnosisResult[];
	loading?: boolean;
	error?: string | null;
	selectedPlant: Plant | null;
	selectedSymptoms: string[];

}

export interface DiagnosisResponse {
	success: boolean;
	results: DiagnosisResult[];
	message?: string;
}

export interface TreatmentRecommendationProps {
	diagnosis: DiagnosisResult
}

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	error?: string;
}

export interface DiagnosisFormState {
	selectedPlant: Plant | null;
	selectedSymptoms: string[];
	isSubmitting: boolean;
	results: DiagnosisResult[] | null;
	error: string | null;
}

export interface LoadingState {
	plants: boolean;
	symptoms: boolean;
	diagnosis: boolean;
}

export interface ErrorState {
	plants: string | null;
	symptoms: string | null;
	diagnosis: string | null;
}

export type SymptomName =
	| 'yellowing_older_leaves'
	| 'yellowing_younger_leaves'
	| 'yellowing_all_leaves'
	| 'purple_discoloration'
	| 'brown_leaf_edges'
	| 'stunted_growth'
	| 'small_cupped_younger_leaves'
	| 'wilting'
	| 'blossom_drop'
	| 'weak_root_development'
	| 'curling_younger_leaves'
	| 'interveinal_chlorosis_older_leaves'
	| 'interveinal_chlorosis_youner_leaves'
	| 'poor_fruit_development';

export type DeficiencyName =
	| 'nitrogen_deficiency'
	| 'phosphorus_deficiency'
	| 'magnesium_deficiency'
	| 'calcium_deficiency'
	| 'iron_deficiency';

export type PlantName =
	| 'spinach'
	| 'tomato'
	| 'cucumber'
	| 'serrano_peppers'
	| 'okra';

export enum WizardStep {
	PLANT_SELECTION,
	SYMPTOM_SELECTION,
	DIAGNOSIS_RESULTS,
}
