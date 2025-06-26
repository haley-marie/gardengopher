-- +goose Up
CREATE TABLE nutrient_deficiencies (
	id UUID PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT,
	treatment TEXT NOT NULL
);

-- +goose Down
DROP TABLE nutrient_deficiencies;
