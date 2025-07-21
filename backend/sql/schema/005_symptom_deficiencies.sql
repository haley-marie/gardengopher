-- +goose Up
CREATE TABLE symptom_deficiencies (
	id SERIAL PRIMARY KEY,
	symptom_id INTEGER NOT NULL REFERENCES symptoms,
	deficiency_id INTEGER NOT NULL REFERENCES nutrient_deficiencies,
	confidence_score DECIMAL (3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE(symptom_id, deficiency_id)
);

-- +goose Down
DROP TABLE symptom_deficiencies;
