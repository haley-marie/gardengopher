-- +goose Up
INSERT INTO symptoms (name, description) VALUES
('yellowing_older_leaves', 'Older leaves turn yellow or pale green'),
('yellowing_younger_leaves', 'Younger leaves turn yellow or pale green'),
('yellowing_all_leaves', 'All leaves turn yellow or pale green'),
('purple_discoloration', 'Purple or reddish tint on leaves or stem'),
('brown_leaf_edges', 'Brown or burnt appearance on leaf margins'),
('stunted_growth', 'Plant growth is slower than expected'),
('small_cupped_younger_leaves', 'Younger leaves on plant are small, dull in appearance, and cupped'),
('wilting', 'Plant is limp or droopy in appearance'),
('blossom_drop', 'Flowers appear, but dry up and fall off before fruit is formed'),
('weak_root_development', 'Roots are short, few in number, or absent. Plant may be unstable in its container'),
('curling_younger_leaves', 'Younger leaves are curled in appearance'),
('interveinal_chlorosis_older_leaves', 'Older leaves yellow specifically between lead veins while veins remain green'),
('interveinal_chlorosis_younger_leaves', 'Younger leaves yellow specifically between lead veins while veins remain green'),
('poor_fruit_development', 'Fruit either does not develop or is small or misshapen once developed');

-- +goose Down
DELETE FROM symptoms WHERE name IN (
	'yellowing_older_leaves', 'yellowing_younger_leaves', 'yellowing_all_leaves', 'purple_discoloration', 'brown_leaf_edges', 'stunted_growth', 'small_cupped_younger_leaves', 'wilting', 'blossom_drop', 'weak_root_development', 'curling_younger_leaves', 'interveinal_chlorosis_younger_leaves', 'interveinal_chlorosis_older_leaves', 'poor_fruit_development'
);

