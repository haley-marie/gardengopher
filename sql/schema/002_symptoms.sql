-- +goose Up
CREATE TABLE symptoms (
	id UUID PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT
);

-- +goose Down
DROP TABLE symptoms;
