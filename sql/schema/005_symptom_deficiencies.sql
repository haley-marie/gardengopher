-- +goose Up
CREATE TABLE symptom_deficiencies (
	symptom_id UUID REFERENCES symptoms,
	deficiency_id UUID REFERENCES nutrient_deficiencies,
	confidence_score NUMERIC
);

-- +goose Down
DROP TABLE symptom_deficiencies;
