INSERT INTO diagnostic_rules (plant_id, conditions_json, deficiency_id) VALUES
(NULL, '{"required_symptoms": ["interveinal_chlorosis_younger_leaves"], "min_symptoms":1, "plant_specific": false}', 6),
(2, '{"required_symptoms": ["yellowing_older_leaves"], "optional_symptoms": ["stunted_growth"], "min_symptoms": 1, "plant_specific": true}', 1),
(NULL, '{"required_symptoms": ["purple_discoloration"], "optional_symptoms": ["stunted_growth"], "min_symptoms": 1, "plant_specific": false}', 2),
(NULL, '{"required_symptoms": ["brown_leaf_edges"], "optional_symptoms": ["purple_discoloration", "poor_fruit_development"], "min_symptoms": 1, "plant_specific": false}', 3),
(NULL, '{"required_symptoms": ["interveinal_chlorosis_older_leaves"], "optional_symptoms": ["interveinal_chlorosis_younger_leaves", "small_cupped_younger_leaves"], "min_symptoms": 1, "plant_specific": false}', 4),
(2,'{"required_symptoms": ["curling_younger_leaves"], "optional_symptoms": ["weak_root_development", "blossom_drop", "poor_fruit_development"], "min_symptoms": 1, "plant_specific": true}', 5);

