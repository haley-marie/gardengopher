-- +goose Up
CREATE TABLE plant_symptoms (
	plant_id BIGINT REFERENCES plants,
	symptom_id BIGINT REFERENCES symptoms,
	severity_weight INTEGER
);

-- +goose Down
DROP TABLE plant_symptoms;
