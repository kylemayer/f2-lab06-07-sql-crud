const ducks = [
  {
    name: 'Bufflehead Duck',
    id: 1,
    mass_oz: 14,
    category_id: 1,
    feet_color: 'orange',
    owner_id: 1
  },
  {
    name: 'Harlequin Duck',
    id: 2,
    mass_oz: 20,
    category_id: 2,
    feet_color: 'brown',
    owner_id: 1
  },
  {
    name: 'Mallard Duck',
    id: 3,
    mass_oz: 50,
    category_id: 3,
    feet_color: 'orange',
    owner_id: 1
  },
  {
    id: 4,
    name: 'Hooded Merganser Duck',
    mass_oz: 25,
    category_id: 2,
    feet_color: 'brown',
    owner_id: 1
  },
  {
    name: 'Muscovy Duck',
    id: 5,
    mass_oz: 180,
    category_id: 4,
    feet_color: 'yellow',
    owner_id: 1
  },
  {
    name: 'Redhead Duck',
    id: 6,
    mass_oz: 35,
    category_id: 2,
    feet_color: 'brown',
    owner_id: 1
  },
  {
    name: 'Wood Duck',
    id: 7,
    mass_oz: 15,
    category_id: 1,
    feet_color: 'yellow',
    owner_id: 1
  },
  {
    name: 'Mandarin Duck',
    id: 8,
    mass_oz: 25,
    category_id: 2,
    feet_color: 'brown',
    owner_id: 1
  }
];

const categories = [
  {
    category: 'compact'
  },
  {
    category: 'medium'
  },
  {
    category: 'large'
  },
  {
    category: 'giant'
  }
];


module.exports = {
  ducks,
  categories
};