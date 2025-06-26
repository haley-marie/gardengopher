-- +goose Up
CREATE TABLE plant_symptoms (
	plant_id UUID REFERENCES plants,
	symptom_id UUID REFERENCES symptoms,
	severity_weight INTEGER
);

-- +goose Down
DROP TABLE plant_symptoms;
