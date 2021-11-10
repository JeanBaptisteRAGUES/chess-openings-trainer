import React from 'react';
import { Fragment } from 'react';
import { GiGears } from 'react-icons/gi';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useState } from 'react/cjs/react.development';
import './puzzles.css';
const openingsList = JSON.parse(localStorage.getItem("openingsList"));

if(openingsList == null){
    console.log("Create openings list");
    localStorage.setItem("openingsList", JSON.stringify({"openings": []}));
}

const Puzzles = () => {
    const [opening, setOpening] = useState('');
    const [isGuided, setIsGuided] = useState(false);

    const updateOpening = (e) => {
        console.log('Update Opening');
        setOpening(e.target.value);
    }

    const startTraining = 
        opening === '' ? 
                <Fragment>
                    <p>Aucune ouverture choisie</p>
                </Fragment>
            :
                <div className="P_trainingLinks">
                    <Link to={'/createPuzzle/' + opening} className="P_linkBtn">
                        <div className="P_choiceBox">
                            <GiGears className="P_choiceIcon"/>
                        </div>
                        <span className="P_choiceSubtitle">Créer/Modifier/Supprimer</span>
                    </Link>
                    <Link to={'/resolvepuzzle/' + opening + 'Puzzles/0/' + isGuided} className="P_linkBtn">
                        <div className="P_choiceBox">
                            <AiOutlinePlayCircle className="P_choiceIcon"/>
                        </div>
                        <span className="P_choiceSubtitle">Jouer</span></Link>
                    <p>
                        <input type="checkbox" id="guidedBtn" name="guidedBtn" onClick={() => setIsGuided(!isGuided)}/>
                        <label htmlFor="guidedBtn">Puzzle guidé</label>
                    </p>
                </div>
        ;

    const displayOpeningsWhite = openingsList["openings"].length > 0 &&
        openingsList["openings"].map(openingOption => {
            if(openingOption[1] === "white"){
                return <option key={openingOption[0]} value={openingOption[0]}>{openingOption[2]}</option>
            }
        });

    const displayOpeningsBlack = openingsList["openings"].length > 0 &&
        openingsList["openings"].map(openingOption => {
            if(openingOption[1] === "black"){
                return <option key={openingOption[0]} value={openingOption[0]}>{openingOption[2]}</option>
            }
        });

    return (
        <div className="P_openingMenu">
            <div className="P_chooseOpening">
                <select onChange={(e) => updateOpening(e)}>
                    <option value=''>--Choisissez une ouverture--</option>
                    <optgroup label="Blancs">
                        {displayOpeningsWhite}
                    </optgroup>
                    <optgroup label="Noirs">
                        {displayOpeningsBlack}
                    </optgroup>
                </select>
                {startTraining}
            </div>
        </div>
    )
}

export default Puzzles;
