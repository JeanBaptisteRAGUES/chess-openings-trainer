import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Landing from '../Landing';
import ErrorPage from '../ErrorPage';
import Training from '../Training';
import CreateOpening from '../CreateOpening';
import CreateOpening2 from '../CreateOpening2';
import Training2 from '../Training2';
import CreatePuzzle from '../CreatePuzzle';
import ResolvePuzzle from '../ResolvePuzzle';

function App() {
  return (
    <Router>
      <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/training/:opening" component={Training} />
          <Route path="/training2/:opening/:guided" component={Training2} />
          <Route path="/createopening/:opening" component={CreateOpening} />
          <Route path="/createopening2/:opening" component={CreateOpening2} />
          <Route path="/createpuzzle/:opening" component={CreatePuzzle} />
          <Route path="/resolvepuzzle/:puzzlesList/:puzzleIndex/:isRandom" component={ResolvePuzzle} />
          <Route component={ErrorPage} />
      </Switch>
    </Router>
  );
}

export default App;