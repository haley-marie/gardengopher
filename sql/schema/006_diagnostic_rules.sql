-- +goose Up
CREATE TABLE diagnostic_rules (
	id UUID PRIMARY KEY,
	plant_id UUID REFERENCES plants,
	conditions_json JSONB,
	deficiency_id UUID REFERENCES nutrient_deficiencies
);

-- +goose Down
DROP TABLE diagnostic_rules;
