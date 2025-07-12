-- +goose Up
INSERT INTO plants (name, scientific_name) VALUES
('Cucumber', 'Cucumis Sativus'),
('Tomato', 'Solanum Lycopersicum'),
('Serrano Pepper', 'Capsicum Annuum'),
('Okra', 'Abelmoschus Esculentus'),
('Spinach', 'Spinacia Oleracea');

-- +goose Down
DELETE FROM plants WHERE name IN ('Cucumber', 'Tomato', 'Serrano Pepper', 'Okra', 'Spinach');

