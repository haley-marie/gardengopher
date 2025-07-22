-- +goose Up
INSERT INTO nutrient_deficiencies (name, description, causes, treatment) VALUES
('nitrogen_deficiency',
 'Insufficient nitrogen for plant growth.',
 'Common causes: excessive watering or waterlogged soil, soil low in organic matter',
 'Ensure plant has adequate drainage, fertilize with balanced fertilizer'),

('phosphorus_deficiency',
 'Insufficient phosphorus for plant growth.',
 'Common causes: cold, wet soil in early spring, pH too high or low, compacted soil',
 'Ensure plant has adequate drainage, amend soil to adjust pH if necessary, till or plow soil, fertilize with bone meal, rock phosphate, or ammonium phosphate.'),

('potassium_deficiency',
 'Insufficient potassium for plant growth',
 'Common causes: excessive watering, pH too high',
 'Water plant less, amend soil to adjust pH if needed, fertilize using wood ash, greensand, potassium sulfate, or potassium chloride.'),

('magnesium_deficiency',
 'Insufficient magnesium for plant growth.',
 'Common causes: pH too acidic',
 'Amend soil to adjust pH if needed, fertilize using dolomitic limestone, epsom salts, or foliar sprays of magnesium sulfate.'),

('calcium_deficiency',
 'Insufficient calcium for plant growth.',
 'Common causes: excessive or not enough watering',
 'Adjust watering schedule, fertilize using gypsum, calcitic lime, calcium sulfate, calcium nitrate, calcium carbonate, or dolomitic limestone.'),

('iron_deficiency',
 'Insufficient iron for plant growth.',
 'Common causes: pH too high, soil low in organic matter',
 'Amend soil to adjust pH if needed, amend soil with a source of organic matter, fertilize using foliar applications of iron chelates, ferrous sulfate, or ferrous ammonium sulfate');

-- +goose Down
DELETE FROM deficiencies WHERE name IN (
	'nitrogen_deficiency', 'phosphorus_deficiency', 'potassium_deficiency', 'magnesium_deficiency', 'calcium_deficiency', 'iron_deficiency'
);
