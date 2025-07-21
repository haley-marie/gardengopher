-- +goose Up
CREATE TABLE plants (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	scientific_name TEXT UNIQUE NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- +goose Down
DROP TABLE plants;
