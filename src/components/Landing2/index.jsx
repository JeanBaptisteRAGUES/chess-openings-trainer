import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/cjs/react.production.min';
import './landing2.css';
import {HiPuzzle} from 'react-icons/hi';
import { FaChessBoard } from 'react-icons/fa';
const openingsList = JSON.parse(localStorage.getItem("openingsList"));

if(openingsList == null){
    console.log("Create openings list");
    localStorage.setItem("openingsList", JSON.stringify({"openings": []}));
}

const Landing2 = () => {
    const [opening, setOpening] = useState('');
    const [newOpeningId, setNewOpeningId] = useState('');
    const [newOpeningName, setNewOpeningName] = useState('');
    const [newOpeningColor, setNewOpeningColor] = useState('');
    const [newOpeningJSON, setNewOpeningJSON] = useState('');
    const [isGuided, setIsGuided] = useState(false);

    const updateOpening = (e) => {
        console.log('Update Opening');
        setOpening(e.target.value);
    }

    const updateNewOpeningId = (e) => {
        setNewOpeningId(e.target.value);
    }

    const updateNewOpeningName = (e) => {
        setNewOpeningName(e.target.value);
    }

    const updateNewOpeningColor = (e) => {
        setNewOpeningColor(e.target.value);
    }

    const updateNewOpeningJSON = (e) => {
        setNewOpeningJSON(e.target.value);
    }

    const createNewOpening = () => {
        openingsList["openings"] = openingsList["openings"].concat([[newOpeningId, newOpeningColor, newOpeningName]]);
        localStorage.setItem("openingsList", JSON.stringify(openingsList));
        if(newOpeningJSON === ""){
            localStorage.setItem(newOpeningId, JSON.stringify({"name": newOpeningName, "playerColor": newOpeningColor, "variantsList": ["moves"], "moves": []}));
        }else{
            let openingJSON = JSON.parse(newOpeningJSON);
            openingJSON["name"] = newOpeningName;
            openingJSON["playerColor"] = newOpeningColor;
            localStorage.setItem(newOpeningId, JSON.stringify(openingJSON));
        }
        setNewOpeningId("");
        setNewOpeningName("");
        setNewOpeningColor("");
        setNewOpeningJSON("");
        console.log(openingsList);
        console.log(localStorage.getItem(newOpeningId));
    }

    const deleteOpening = () => {
        const newOpeningsList = openingsList["openings"].filter((op) => {
            return op[0] !== opening;
        });
        openingsList["openings"] = newOpeningsList;
        localStorage.setItem("openingsList", JSON.stringify(openingsList));
        localStorage.removeItem(opening);
        localStorage.removeItem(opening+"Puzzles");
        setOpening("");
    }

    const confirmDeleteOpening = () => {
        if(window.confirm("Voulez-vous vraiment supprimer cette ouverture ?")){
            deleteOpening();
        }
    }

    const selectRandomOpening = () => {
        const openingsList = JSON.parse(localStorage.getItem("openingsList"));
        const randOpeningIndex = Math.floor(Math.random()*openingsList["openings"].length);
        const randOpeningID = openingsList["openings"][randOpeningIndex][0];
        
        return randOpeningID;
    }

    const selectRandomPuzzle = (myOpening = null) => {
        let randOpening = myOpening;
        let randOpeningIndex = null;
        let randOpeningID = null;
        let incr = 0;
        const openingsList = JSON.parse(localStorage.getItem("openingsList"));
        //console.log("Openings List : " + JSON.stringify(openingsList));
        while(randOpening === null){
            if(incr > 200) return null;
            randOpeningIndex = Math.floor(Math.random()*openingsList["openings"].length);
            //console.log("Rand Opening Index : " + randOpeningIndex);
            randOpeningID = openingsList["openings"][randOpeningIndex][0] + "Puzzles";
            console.log("Rand Opening ID : " + randOpeningID);
            randOpening = JSON.parse(localStorage.getItem(randOpeningID));
            //console.log("Rand Opening : " + randOpening);
            incr++;
        }

        const randOpeningPuzzlesList = randOpening["puzzles"];
        const randOpeningPuzzlesIndex = Math.floor(Math.random()*randOpeningPuzzlesList.length);

        return [randOpeningID, randOpeningPuzzlesIndex];
    }

    const [openingPuzzleId, puzzleIndex] = selectRandomPuzzle();
    const randOpening = selectRandomOpening();

    const startTraining = 
        opening === '' ? 
                <Fragment>
                    <p>Aucune ouverture choisie</p>
                    <Link to={'/resolvepuzzle/' + openingPuzzleId + '/' + (puzzleIndex) + '/' + true}>Puzzle aléatoire</Link>
                    <Link to={'/training2/' + randOpening}>Ouverture aléatoire</Link>
                </Fragment>
            :
                <div className="L_trainingLinks">
                    <Link to={'/training2/' + opening + '/' + isGuided} className="L_linkBtn">S'entrainer ({opening})</Link>
                    <Link to={'/createOpening2/' + opening} className="L_linkBtn">Modifier({opening})</Link>
                    <Link to={'/createPuzzle/' + opening} className="L_linkBtn">Puzzles ({opening})</Link>
                    <div className="L_clickableBtn" onClick={() => confirmDeleteOpening()}>Supprimer</div>
                    <p>
                        <input type="checkbox" id="guidedBtn" name="guidedBtn" onClick={() => setIsGuided(!isGuided)}/>
                        <label htmlFor="guidedBtn">Ouverture guidée</label>
                    </p>
                </div>
    ;

    const createOpening = newOpeningName.length < 5 || newOpeningId.length < 5 || newOpeningColor.length === 0 ?
                <p>Entrez les paramètres de votre nouvelle ouverture</p>
            :
                newOpeningId.match(/^[0-9a-zA-Z]+$/) ?
                    <button onClick={() => createNewOpening()}>Nouvelle Ouverture</button>
                :
                    <p>Pour l'identifiant, seuls les caractères alphanumériques sont autorisés !</p>

    //console.log(openingsList["openings"]);
    
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

    const displayOpenings = () => {
        console.log(openingsList);
        if(opening !== "") console.log(JSON.parse(localStorage.getItem(opening)));
        //if(opening !== "") console.log(localStorage.getItem(opening));
        //let savedOpening = {"name":"London System","playerColor":"white","variantsList":["d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3d6g3","d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3bo-o","d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3bo-oa7a6","d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3bo-od6e5","d2d4d7d5c1f4g8f6e2e3e7e6","d2d4d7d5c1f4g8f6e2e3c7c5","d2d4d7d5","d2d4g8f6","d2d4g8f6f8g7","d2d4g8f6d7d5","d2d4g8f6d7d5bo-o","d2d4g8f6d7d5h7h5","d2d4g8f6g7g6","d2d4g8f6c7c5"],"moves":[["m",["d2","d4",0]],["v",["d2d4d7d5","d2d4g8f6"]]],"d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3d6g3":[["v",["moves"]],["m",["d6","g3",14]],["m",["h2","g3",24]]],"d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3bo-o":[["v",["moves"]],["c",["b","o-o"]],["m",["f1","d3",0]],["m",["b8","c6",0]],["m",["c2","c3",0]],["m",["c8","d7",0]],["m",["b1","d2",0]],["m",["d8","e7",0]],["m",["f3","e5",0]],["v",["d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3bo-oa7a6","d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3bo-od6e5"]]],"d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3bo-oa7a6":[["v",["d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3bo-o"]],["m",["a7","a6",0]],["c",["w","o-o"]]],"d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3bo-od6e5":[["v",["d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3bo-o"]],["m",["d6","e5",13]],["m",["d4","e5",24]],["m",["f6","e8",0]],["m",["e3","e4",0]],["m",["d5","e4",11]],["m",["d2","e4",21]]],"d2d4d7d5c1f4g8f6e2e3e7e6":[["v",["moves"]],["m",["e7","e6",0]],["m",["g1","f3",0]],["m",["f8","d6",0]],["m",["f4","g3",0]],["v",["d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3d6g3","d2d4d7d5c1f4g8f6e2e3e7e6g1f3f8d6f4g3bo-o"]]],"d2d4d7d5c1f4g8f6e2e3c7c5":[["v",["moves"]],["m",["c7","c5",0]],["m",["g1","f3",0]],["m",["d8","b6",0]],["m",["b1","c3",0]],["m",["b6","b2",11]],["m",["c3","b5",0]],["m",["b8","a6",0]],["m",["a1","b1",0]],["m",["b2","a2",11]],["m",["b1","a1",0]],["m",["a2","b2",0]],["m",["a1","a6",23]],["m",["b7","a6",12]],["m",["b5","c7",0]],["m",["e8","d8",0]],["m",["c7","a8",22]]],"d2d4d7d5":[["v",["moves"]],["m",["d7","d5",0]],["m",["c1","f4",0]],["m",["g8","f6",0]],["m",["e2","e3",0]],["v",["d2d4d7d5c1f4g8f6e2e3e7e6","d2d4d7d5c1f4g8f6e2e3c7c5"]]],"d2d4g8f6":[["v",["moves"]],["m",["g8","f6",0]],["m",["c1","f4",0]],["v",["d2d4g8f6g7g6","d2d4g8f6c7c5"]]],"d2d4g8f6f8g7":[["v",["d2d4g8f6"]],["m",["f8","g7",0]],["m",["e2","e4",0]],["m",["d7","d6",0]],["m",["d1","d2",0]]],"d2d4g8f6d7d5":[["v",["d2d4g8f6"]],["m",["d7","d5",0]],["m",["e2","e3",0]],["m",["f8","g7",0]],["m",["h2","h4",0]],["v",["d2d4g8f6d7d5bo-o","d2d4g8f6d7d5h7h5"]]],"d2d4g8f6d7d5bo-o":[["v",["d2d4g8f6d7d5"]],["c",["b","o-o"]],["m",["h4","h5",0]],["m",["f6","h5",11]],["m",["h1","h5",23]],["m",["g6","h5",12]],["m",["d1","h5",21]]],"d2d4g8f6d7d5h7h5":[["v",["d2d4g8f6d7d5"]],["m",["h7","h5",0]],["m",["g1","f3",0]]],"d2d4g8f6g7g6":[["v",["d2d4g8f6"]],["m",["g7","g6",0]],["m",["b1","c3",0]],["v",["d2d4g8f6f8g7","d2d4g8f6d7d5"]]],"d2d4g8f6c7c5":[["v",["d2d4g8f6"]],["m",["c7","c5",0]],["m",["d4","d5",0]],["m",["d7","d6",0]],["m",["b1","c3",0]]]};
        //localStorage.setItem("londonSystem", JSON.stringify(savedOpening));
    }

    const displayOpeningJSON = opening !== "" && (
        <div className="L_openingJSON">
            <h2>{JSON.parse(localStorage.getItem(opening))["name"]} (JSON)</h2>
            <p>
                {localStorage.getItem(opening)}
            </p>      
        </div>
    )

    return (
        <div className="L_landingContainer">
            <div className="L_welcome">
                <h1 onClick={() => displayOpenings()}>Bienvenue !</h1>
                <p>
                    Ici vous pourrez vous entrainez sur différentes ouvertures d'échecs ainsi que leurs variantes !<br/>
                    Une fois une ouverture sélectionnée, l'ordinateur va jouer les coups enregistrés jusqu'à ce que <br/>
                    vous vous trompiez, auquel cas un message d'erreur s'affichera.
                </p>
            </div>
            <br/>
            <div className="L_menu">
                <Link to="/puzzles" className="L_choiceContainer">
                    <div className="L_choiceBox">
                        <HiPuzzle className="L_choiceIcon"/>
                    </div>
                    <span className="L_choiceSubtitle">Puzzles</span>
                </Link>
                <Link to="/openings"  className="L_choiceContainer">
                    <div className="L_choiceBox">
                        <FaChessBoard className="L_choiceIcon"/>
                    </div>
                    <span className="L_choiceSubtitle">Ouvertures</span>
                </Link>
            </div>
        </div>
    )
}

export default Landing2;