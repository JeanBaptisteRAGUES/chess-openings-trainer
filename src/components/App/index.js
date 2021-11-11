import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Landing2 from '../Landing2';
import ErrorPage from '../ErrorPage';
import CreateOpening from '../CreateOpening';
import Training2 from '../Training2';
import CreatePuzzle from '../CreatePuzzle';
import ResolvePuzzle from '../ResolvePuzzle';
import Header from '../Header';
import Puzzles from '../Puzzles';
import Openings from '../Openings';
import ModifyOpening from '../ModifyOpening';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
          <Route exact path="/" component={Landing2} />
          <Route path="/openings" component={Openings} />
          <Route path="/puzzles" component={Puzzles} />
          <Route path="/training2/:opening/:guided" component={Training2} />
          <Route path="/createopening/" component={CreateOpening} />
          <Route path="/modifyOpening/:opening" component={ModifyOpening} />
          <Route path="/createpuzzle/:opening" component={CreatePuzzle} />
          <Route path="/resolvepuzzle/:puzzlesList/:puzzleIndex/:isRandom" component={ResolvePuzzle} />
          <Route component={ErrorPage} />
      </Switch>
    </Router>
  );
}

export default App;