import React from 'react';
import { Fragment } from 'react';
import { GiGears } from 'react-icons/gi';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { RiAddCircleLine } from 'react-icons/ri';
import { VscJson } from 'react-icons/vsc';
import { Link } from 'react-router-dom';
import { useState } from 'react/cjs/react.development';
import './openings.css';
const openingsList = JSON.parse(localStorage.getItem("openingsList"));

if(openingsList == null){
    console.log("Create openings list");
    localStorage.setItem("openingsList", JSON.stringify({"openings": []}));
}

const Openings = () => {
    const [opening, setOpening] = useState('');
    const [isGuided, setIsGuided] = useState(false);
    const [openingJSON, setOpeningJSON] = useState('');

    const updateOpening = (e) => {
        console.log('Update Opening');
        setOpening(e.target.value);
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
        window.location.reload();
    }

    const confirmDeleteOpening = () => {
        if(window.confirm("Voulez-vous vraiment supprimer cette ouverture ?")){
            deleteOpening();
        }
    }

    const displayOpening = () =>{
        setOpeningJSON(localStorage.getItem(opening));
    }

    const closeDisplayJSON = () => {
        setOpeningJSON('');
    }

    const displayOpeningJSON = openingJSON !== '' && 
        <div className="O_containerJSON">
            <div className="O_openingDataJSON">
                <h2>{JSON.parse(localStorage.getItem(opening))["name"]} (JSON)</h2>
                <p>
                    {localStorage.getItem(opening)}
                </p> 
            </div>
            <button onClick={() => closeDisplayJSON()}>Fermer</button>
        </div>

    const startTraining = 
        opening === '' ? 
                <div className="O_optionsContainer">
                    <p>Aucune ouverture choisie</p>
                    <Link to={'/createOpening/'} className="O_linkBtn">
                        <div className="O_choiceBox">
                            <RiAddCircleLine className="O_choiceIcon"/>
                        </div>
                        <span className="O_choiceSubtitle">Nouvelle ouverture</span>
                    </Link>
                </div>
            :
                <div className="O_optionsContainer">
                    <div className="O_trainingLinks">
                        <Link to={'/modifyOpening/' + opening} className="O_linkBtn">
                            <div className="O_choiceBox">
                                <GiGears className="O_choiceIcon"/>
                            </div>
                            <span className="O_choiceSubtitle">Modifier</span>
                        </Link>
                        <Link to={'/training2/' + opening + '/' + isGuided} className="O_linkBtn">
                            <div className="O_choiceBox">
                                <AiOutlinePlayCircle className="O_choiceIcon"/>
                            </div>
                            <span className="O_choiceSubtitle">S'entrainer</span>
                        </Link>
                        <div className="O_clickableBtn" onClick={() => confirmDeleteOpening()}>
                            <div className="O_choiceBox">
                                <RiDeleteBin6Line className="O_choiceIcon"/>
                            </div>
                            <span className="O_choiceSubtitle">Supprimer</span>
                        </div>
                        <div className="O_clickableBtn" onClick={() => displayOpening()}>
                            <div className="O_choiceBox">
                                <VscJson className="O_choiceIcon"/>
                            </div>
                            <span className="O_choiceSubtitle">Afficher JSON</span>
                        </div>
                    </div>
                    <p>
                        <input type="checkbox" id="guidedBtn" name="guidedBtn" onClick={() => setIsGuided(!isGuided)}/>
                        <label htmlFor="guidedBtn">Ouverture guidée</label>
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
        <div className="O_openingMenu">
            <div className="O_chooseOpening">
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
            {displayOpeningJSON}
        </div>
    )
}

export default Openings;
