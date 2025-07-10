INSERT INTO symptom_deficiencies (symptom_id, deficiency_id, confidence_score)
SELECT s.id, nd.id, temp.confidence_score
	FROM temp_symptom_deficiencies temp
	JOIN symptoms s ON s.name = temp.symptom_name
	JOIN nutrient_deficiencies nd ON nd.name = temp.deficiency_name;
