import React from "react";
import WorldFellowsMap from "./WorldFellowsMap";
import "leaflet/dist/leaflet.css";

const fellowsData = [
    // 2025 cohort
    { name: "Steven Adler", city: "San Francisco", country: "USA", year: 2025 },
    { name: "Andrew Burleson", city: "Denver", country: "USA", year: 2025 },
    { name: "Byron Cohen", city: "Washington DC", country: "USA", year: 2025 },
    { name: "Tim Durham", city: "Roanoke", country: "USA", year: 2025 },
    { name: "Sam Enright", city: "Dublin", country: "Ireland", year: 2025 },
    { name: "Étienne Fortier-Dubois", city: "Montreal", country: "Canada", year: 2025 },
    { name: "Lesley Gao", city: "San Francisco", country: "USA", year: 2025 },
    { name: "Michael Hill", city: "London", country: "UK", year: 2025 },
    { name: "Heidi Huang", city: "Boston", country: "USA", year: 2025 },
    { name: "Hiya Jain", city: "Ahmedabad", country: "India", year: 2025 },
    { name: "Adam Kroetsch", city: "San Francisco", country: "USA", year: 2025 },
    { name: "Alex Kustov", city: "Charlotte", country: "USA", year: 2025 },
    { name: "Allison Lehman", city: "Minneapolis", country: "USA", year: 2025 },
    { name: "Anton Leicht", city: "Berlin", country: "Germany", year: 2025 },
    { name: "Laura Mazer", city: "Austin", country: "USA", year: 2025 },
    { name: "Pouya Nikmand", city: "Austin", country: "USA", year: 2025 },
    { name: "Seán O'Neill McPartlin", city: "Dublin", country: "Ireland", year: 2025 },
    { name: "Ariel Patton", city: "San Francisco", country: "USA", year: 2025 },
    { name: "Rhishi Pethe", city: "San Francisco", country: "USA", year: 2025 },
    { name: "Venkatesh Ranjan", city: "Phoenix", country: "USA", year: 2025 },
    { name: "Abby ShalekBriski", city: "Raleigh", country: "USA", year: 2025 },
    { name: "Ibis Slade", city: "Austin", country: "USA", year: 2025 },
    { name: "Colleen Smith", city: "New York", country: "USA", year: 2025 },
    { name: "Benedict Springbett", city: "London", country: "UK", year: 2025 },
    { name: "Smrithi Sunil", city: "Madison", country: "USA", year: 2025 },
    { name: "Karthik Tadepalli", city: "San Francisco", country: "USA", year: 2025 },
    { name: "Deric Tilson", city: "Washington DC", country: "USA", year: 2025 },
    { name: "Nehal Udyavar", city: "Toronto", country: "Canada", year: 2025 },
    { name: "Elizabeth Van Nostrand", city: "San Francisco", country: "USA", year: 2025 },
    { name: "Kelly Vedi", city: "Orlando", country: "USA", year: 2025 },
    { name: "Afra Wang", city: "San Francisco", country: "USA", year: 2025 },
    { name: "Afra Wang", city: "London", country: "UK", year: 2025 },
    { name: "Connor O’Brien", city: "Washington DC", country: "USA", year: 2025 },
    { name: "Ryan Puzycki", city: "Austin", country: "USA", year: 2025 },
    { name: "Jacob Rintamaki", city: "San Francisco", country: "USA", year: 2025 },
    { name: "Raiany Romanni", city: "Boston", country: "USA", year: 2025 },
    { name: "Madeline Zimmerman", city: "New York City", country: "USA", year: 2025 },

    // 2024 cohort
    { name: "Dean Ball", city: "Washington DC", country: "USA", year: 2024 },
    { name: "Rosie Campbell", city: "Oakland", country: "USA", year: 2024 },
    { name: "Sarah Constantin", city: "New York", country: "USA", year: 2024 },
    { name: "Sean Fleming", city: "Santa Monica", country: "USA", year: 2024 },
    { name: "Jeff Fong", city: "San Francisco", country: "USA", year: 2024 },
    { name: "Lauren Gilbert", city: "Washington DC", country: "USA", year: 2024 },
    { name: "Dominik Hermle", city: "Berlin", country: "Germany", year: 2024 },
    { name: "Mary Hui", city: "Hong Kong", country: "China", year: 2024 },
    { name: "Ben James", city: "London", country: "UK", year: 2024 },
    { name: "Kevin Kohler", city: "Zurich", country: "Switzerland", year: 2024 },
    { name: "Rob L'Heureux", city: "San Francisco", country: "USA", year: 2024 },
    { name: "Robert Long", city: "San Francisco", country: "USA", year: 2024 },
    { name: "Quade MacDonald", city: "Washington DC", country: "USA", year: 2024 },
    { name: "Niko McCarty", city: "Boston", country: "USA", year: 2024 },
    { name: "Duncan McClements", city: "Cambridge", country: "UK", year: 2024 },
    { name: "Jordan McGillis", city: "San Diego", country: "USA", year: 2024 },
    { name: "Jonah Messinger", city: "London", country: "UK", year: 2024 },
    { name: "Andrew Miller", city: "Toronto", country: "Canada", year: 2024 },
    { name: "Grant Mulligan", city: "Denver", country: "USA", year: 2024 },
    { name: "Steve Newman", city: "San Francisco", country: "USA", year: 2024 },
    { name: "Jannik Reigl", city: "Munich", country: "Germany", year: 2024 },
    { name: "Julius Simonelli", city: "San Diego", country: "USA", year: 2024 },
    { name: "Ruxandra Teslo", city: "Cambridge", country: "UK", year: 2024 },
    { name: "Dynomight", city: "", country: "", year: 2024 },

    // 2023 cohort
    { name: "Brian Balkus", city: "Los Angeles", country: "USA", year: 2023 },
    { name: "Maarten Boudry", city: "Ghent", country: "Belgium", year: 2023 },
    { name: "Malcolm Cochran", city: "Washington DC", country: "USA", year: 2023 },
    { name: "Jeremy Côté", city: "Sherbrooke", country: "Canada", year: 2023 },
    { name: "Grant Dever", city: "Austin", country: "USA", year: 2023 },
    { name: "Elle Griffin", city: "Salt Lake City", country: "USA", year: 2023 },
    { name: "Paige Lambermont", city: "Orlando", country: "USA", year: 2023 },
    { name: "Laura London", city: "Santa Monica", country: "USA", year: 2023 },
    { name: "Tina Marsh Dalton", city: "Winston-Salem", country: "USA", year: 2023 },
    { name: "Florian Metzler", city: "Boston", country: "USA", year: 2023 },
    { name: "Fin Moorhouse", city: "Oxford", country: "UK", year: 2023 },
    { name: "Jenni Morales", city: "Salt Lake City", country: "USA", year: 2023 },
    { name: "Connor O’Brien", city: "Washington DC", country: "USA", year: 2023 },
    { name: "Ryan Puzycki", city: "Austin", country: "USA", year: 2023 },
    { name: "Jacob Rintamaki", city: "San Francisco", country: "USA", year: 2023 },
    { name: "Raiany Romanni", city: "Boston", country: "USA", year: 2023 },
    { name: "Max Tabarrok", city: "Boston", country: "USA", year: 2023 },
    { name: "Max Tabarrok", city: "Washington DC", country: "USA", year: 2023 }, // two-city fellow
    { name: "Alex Telford", city: "Zurich", country: "Switzerland", year: 2023 },
    { name: "Madeline Zimmerman", city: "New York City", country: "USA", year: 2023 },
  ];

function App() {
  return (
    <div style={{ height: "100vh" }}>
      <WorldFellowsMap data={fellowsData} height={window.innerHeight - 50} />
    </div>
  );
}

export default App;

