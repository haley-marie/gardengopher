-- +goose Up
CREATE TABLE nutrient_deficiencies (
	id SERIAL PRIMARY KEY,
	name TEXT UNIQUE NOT NULL,
	description TEXT NOT NULL,
	causes TEXT NOT NULL,
	treatment TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- +goose Down
DROP TABLE nutrient_deficiencies;
