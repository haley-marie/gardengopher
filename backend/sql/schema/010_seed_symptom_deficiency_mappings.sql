-- +goose Up
INSERT INTO symptom_deficiencies (symptom_id, deficiency_id, confidence_score)
SELECT
	s.id as symptom_id,
	d.id as deficiency_id,
	mappings.confidence_score
FROM (VALUES
	-- Format: (symptom_name, deficiency_name, confidence_score)
	('yellowing_older_leaves', 'nitrogen_deficiency', 0.85),
	('yellowing_older_leaves', 'potassium_deficiency', 0.65),
	('yellowing_older_leaves', 'phosphorus_deficiency', 0.70),
	('yellowing_younger_leaves', 'iron_deficiency', 0.85),
	('purple_discoloration', 'phosphorus_deficiency', 0.85),
	('brown_leaf_edges', 'potassium_deficiency', 0.80),
	('stunted_growth', 'nitrogen_deficiency', 0.70),
	('stunted_growth', 'potassium_deficiency', 0.70),
	('stunted_growth', 'phosphorus_deficiency', 0.75),
	('small_cupped_younger_leaves', 'magnesium_deficiency', 0.90),
	('wilting', 'nitrogen_deficiency', 0.60),
	('wilting', 'potassium_deficiency', 0.70),
	('curling_younger_leaves', 'calcium_deficiency', 0.80),
	('interveinal_chlorosis_older_leaves', 'magnesium_deficiency', 0.75),
	('interveinal_chlorosis_younger_leaves', 'iron_deficiency', 0.65),
	('poor_fruit_development', 'calcium_deficiency', 0.80),
	('weak_root_development', 'calcium_deficiency', 0.85),
	('blossom_drop', 'calcium_deficiency', 0.75)
) AS mappings(symptom_name, deficiency_name, confidence_score)
JOIN symptoms s ON s.name = mappings.symptom_name
JOIN nutrient_deficiencies d on d.name = mappings.deficiency_name;

-- +goose Down
DELETE FROM symptom_deficiencies;
