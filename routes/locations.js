const express = require('express');
const router = express.Router();

const locations = [
  {
    id: "main-gate",
    name: "Main Campus Gate & Admissions",
    category: "Entrance",
    type: "Entrance",
    description: "Main Campus Entrance, Visitor Gate & Admissions Office",
    lat: 12.798920,
    lng: 80.228150
  },
  {
    id: "founders-block",
    name: "Founders Block",
    category: "Administration",
    type: "Administration",
    description: "Founders Administrative Block & Offices",
    lat: 12.799510,
    lng: 80.227480
  },
  {
    id: "main-block",
    name: "Main Academic Block",
    category: "Academic",
    type: "Academic",
    description: "Main Academic Classrooms, Lecture Halls & Faculty",
    lat: 12.799840,
    lng: 80.227120
  },
  {
    id: "aeronautical-hangar",
    name: "School of Aeronautical Sciences & Hangar",
    category: "Academic / Lab",
    type: "Academic / Lab",
    description: "Aeronautical Sciences, Aircraft Hangar & Flight Labs",
    lat: 12.800450,
    lng: 80.226720
  },
  {
    id: "central-library",
    name: "HITS Central Library & Research Centre",
    category: "Facility",
    type: "Facility",
    description: "Central University Library, Digital Hub & Research Centre",
    lat: 12.800920,
    lng: 80.224850
  },
  {
    id: "mgr-auditorium",
    name: "MGR Auditorium",
    category: "Events",
    type: "Events",
    description: "University Auditorium, Conventions & Cultural Events",
    lat: 12.801120,
    lng: 80.224150
  },
  {
    id: "jubilee-block",
    name: "Jubilee Block",
    category: "Academic",
    type: "Academic",
    description: "Jubilee Academic Block & Computing Labs",
    lat: 12.801540,
    lng: 80.224020
  },
  {
    id: "symphony-spade",
    name: "Symphony Building & SPADE",
    category: "Academic / Design",
    type: "Academic / Design",
    description: "School of Planning, Architecture & Design (SPADE)",
    lat: 12.800810,
    lng: 80.223530
  },
  {
    "id": "basketball-court",
    name: "Basketball Court & Sports Complex",
    category: "Sports",
    type: "Sports",
    description: "Campus Basketball Court & Sports Complex",
    lat: 12.801250,
    lng: 80.225300
  },
  {
    id: "tennis-court",
    name: "HITS Tennis Court",
    category: "Sports",
    type: "Sports",
    description: "Tennis Courts & Outdoor Athletic Facilities",
    lat: 12.801480,
    lng: 80.225640
  },
  {
    id: "jupiter-hostel",
    name: "Jupiter Hostel & Dining Hall",
    category: "Residential",
    type: "Residential",
    description: "Student Residential Hostel & Dining Hall",
    lat: 12.802820,
    lng: 80.225810
  }
];

// GET /api/locations - Returns all campus locations
router.get('/', (req, res) => {
  const { type, category, search } = req.query;
  const filterCat = type || category;

  let filtered = locations;

  if (filterCat && filterCat.toLowerCase() !== 'all') {
    const target = filterCat.toLowerCase();
    filtered = filtered.filter(loc =>
      (loc.category && loc.category.toLowerCase() === target) ||
      (loc.type && loc.type.toLowerCase() === target)
    );
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(loc =>
      loc.name.toLowerCase().includes(q) ||
      (loc.description && loc.description.toLowerCase().includes(q)) ||
      (loc.category && loc.category.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
});

// GET /api/locations/:id - Returns a single location
router.get('/:id', (req, res) => {
  const location = locations.find(loc => String(loc.id) === String(req.params.id));
  if (!location) {
    return res.status(404).json({ success: false, message: 'Location not found' });
  }
  res.json({ success: true, data: location });
});

module.exports = router;
