var ace = ace || {};
ace.heightMap = [];

ace.tileMap = [[
  [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
  [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
  [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
  [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
  [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
  [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
  [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
  [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
  [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
  [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82],
  [82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82,82]
], [
  [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
  [10,16,16,16,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,10,16,16,16],
  [10,16,16,68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,63,10,10,16,16,68, 0, 0, 0, 0, 0, 0, 0, 0, 0,68,10,10],
  [10,16,68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10,10,16,68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,68,10,10],
  [10,68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,63,10,68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
  [10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
  [10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,28,10,10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
  [10,10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10,10,10,10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10],
  [10,10,10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0,28,10,10,10,10,10,13, 0, 0, 0, 0, 0, 0, 0, 0, 0,28,10,10],
  [10,10,10,10,10,10,10,10,11,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,16,10,10,10,10,10,10,10],
  [10,10,10,10,10,10,10,10,16,16,16,16,16,16,16,16,10,10,10,10,10,10,10,10,16,16,16,16,16,16,16,16]
]];

for (var z = 0; z < ace.tileMap.length; z++) {
  for (var y = 0; y < ace.tileMap[z].length; y++) {
    ace.heightMap[y] = ace.heightMap[y] || [];
    for (var x = 0; x < ace.tileMap[z][y].length; x++) {
      if (!ace.heightMap[y][x]) {
        ace.heightMap[y][x] = 0;
      }
      if (ace.tileMap[z][y][x]) {
        ace.heightMap[y][x] += 16;
      }
    }
  }
}

ace.tileNamesById = {
  '0': 'nothing',
  '66': 'forest_rock_t',
  '3': 'forest_rock_tl',
  '75': 'forest_rock_tr',
  '5': 'forest_rock_br',
  '8': 'forest_rock_bl',
  '10': 'forest_rock',
  '55': 'ow_rock_t',
  '13': 'ow_rock_br',
  '28': 'ow_rock_bl',
  '63': 'ow_rock_tl',
  '68': 'ow_rock_tr',
  '16': 'ow_rock',
  '82': 'ow_ground',
  '11': 'ow_path'
};

ace.isWalkableByName = {
  'nothing': true,
  'ow_ground': true,
  'ow_path': true
};
