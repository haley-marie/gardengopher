-- name: GetSymptomMap :many
SELECT id, name FROM symptoms ORDER BY name;

-- name: GetDeficiency :one
SELECT id, name, description, causes, treatment
FROM nutrient_deficiencies
WHERE id = $1;

-- name: GetConfidenceBasedDiagnosis :many
SELECT
	sdm.deficiency_id,
	AVG(sdm.confidence_score) as avg_confidence,
	COUNT(*) as symptom_count
FROM symptom_deficiencies sdm
WHERE sdm.symptom_id = ANY($1::int[])
GROUP BY sdm.deficiency_id
ORDER BY avg_confidence DESC;

-- name: GetDiagnosticRulesByPlant :many
SELECT id, plant_id, conditions_json, deficiency_id
FROM diagnostic_rules
WHERE plant_id IS NULL OR plant_id = $1;

-- name: GetPlants :many
SELECT id, name, scientific_name FROM plants ORDER BY scientific_name;

-- name: GetDeficiencies :many
SELECT id, name, description, causes, treatment FROM nutrient_deficiencies ORDER BY name;

-- name: GetSymptoms :many
SELECT id, name, description FROM symptoms ORDER BY name;
