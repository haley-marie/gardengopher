-- +goose Up
CREATE TABLE diagnostic_rules (
	id SERIAL PRIMARY KEY,
	plant_id INTEGER REFERENCES plants, -- NULL for general rules
	conditions_json JSONB NOT NULL,
	deficiency_id INTEGER NOT NULL REFERENCES nutrient_deficiencies,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- +goose Down
DROP TABLE diagnostic_rules;
