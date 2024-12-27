import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// Sample Tourist Places Data
const touristPlaces = [
  { id: 1, name: 'Eiffel Tower', location: 'Paris, France' },
  { id: 2, name: 'Great Wall of China', location: 'China' },
  { id: 3, name: 'Taj Mahal', location: 'Agra, India' },
  { id: 4, name: 'Colosseum', location: 'Rome, Italy' },
  { id: 5, name: 'Statue of Liberty', location: 'New York, USA' },
];

const HomePage = () => {
  return (
    <div>
      <header>
        <h1>VentureVista - Tourist Places</h1>
        <p>Explore the world's most famous tourist destinations</p>
      </header>
      <section>
        <h2>Popular Tourist Places</h2>
        <ul>
          {touristPlaces.map((place) => (
            <li key={place.id}>
              <h3>{place.name}</h3>
              <p>{place.location}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    </Router>
  );
}

export default App;
