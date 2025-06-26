-- +goose Up
CREATE TABLE plants (
	id UUID PRIMARY KEY,
	name TEXT NOT NULL,
	scientific_name TEXT UNIQUE NOT NULL
);

-- +goose Down
DROP TABLE plants;
