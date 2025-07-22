-- +goose Up
INSERT INTO diagnostic_rules (plant_id, conditions_json, deficiency_id)
SELECT
	p.id as plant_id, 
	rules.conditions_json::jsonb,
	d.id as deficiency_id
FROM (VALUES
	-- Format: (plant_name, conditions_json, deficiency_name)
	-- NULL plant_name represents a general rule
	(NULL,
	'{"required_symptoms": ["interveinal_chlorosis_younger_leaves"], "min_symptoms":1, "plant_specific": false}', 
	'iron_deficiency'),

	('Tomato',
	'{"required_symptoms": ["yellowing_older_leaves"], "optional_symptoms": ["stunted_growth"], "min_symptoms": 1, "plant_specific": true}', 
	'nitrogen_deficiency'),

	(NULL,
	'{"required_symptoms": ["purple_discoloration"], "optional_symptoms": ["stunted_growth"], "min_symptoms":1, "plant_specific": false}', 
	'phosphorus_deficiency'),
	
	(NULL,
	'{"required_symptoms": ["brown_leaf_edges"], "optional_symptoms": ["purple_discoloration", "poor_fruit_development"], "min_symptoms": 1, "plant_specific": false}', 
	'potassium_deficiency'),

	(NULL,
	'{"required_symptoms": ["interveinal_chlorosis_older_leaves"], "optional_symptoms": ["interveinal_chlorosis_younger_leaves", "small_cupped_younger_leaves"], "min_symptoms": 1, "plant_specific": false}', 
	'magnesium_deficiency'),

	('Tomato',
	'{"required_symptoms": ["curling_younger_leaves"], "optional_symptoms": ["weak_root_devlopment", "blossom_drop", "poor_fruit_development"], "min_symptoms": 1, "plant_specific": true}', 
	'calcium_deficiency')
) AS rules(plant_name, conditions_json, deficiency_name)
LEFT JOIN plants p ON p.name = rules.plant_name
JOIN nutrient_deficiencies d ON d.name = rules.deficiency_name;

-- +goose Down
DELETE FROM diagnostic_rules;
