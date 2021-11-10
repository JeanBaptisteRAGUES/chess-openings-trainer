import React from 'react';
import { useState } from 'react/cjs/react.development';
const openingsList = JSON.parse(localStorage.getItem("openingsList"));

if(openingsList == null){
    console.log("Create openings list");
    localStorage.setItem("openingsList", JSON.stringify({"openings": []}));
}

const CreateOpening = () => {
    const [newOpeningId, setNewOpeningId] = useState('');
    const [newOpeningName, setNewOpeningName] = useState('');
    const [newOpeningColor, setNewOpeningColor] = useState('');
    const [newOpeningJSON, setNewOpeningJSON] = useState('');

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

    const createOpening = newOpeningName.length < 5 || newOpeningId.length < 5 || newOpeningColor.length === 0 ?
            <p>Entrez les paramètres de votre nouvelle ouverture</p>
        :
            newOpeningId.match(/^[0-9a-zA-Z]+$/) ?
                <button onClick={() => createNewOpening()}>Nouvelle Ouverture</button>
            :
                <p>Pour l'identifiant, seuls les caractères alphanumériques sont autorisés !</p>

    return (
        <div className="L_createOpening">
            <input value={newOpeningId} className="L_createInput" placeholder="Nouvelle ouverture (id)" onChange={(e) => updateNewOpeningId(e)}></input>
            <input value={newOpeningName} className="L_createInput" placeholder="Nouvelle ouverture (nom)" onChange={(e) => updateNewOpeningName(e)}></input>
            <select className="L_createSelector" onChange={(e) => updateNewOpeningColor(e)}>
                <option value=''>--Choisissez une couleur--</option>
                <option value='white'>Blancs</option>
                <option value='black'>Noirs</option>
            </select>
            <textarea value={newOpeningJSON} className="L_createInput" placeholder="JSON de l'ouverture (optionnel)" onChange={(e) => updateNewOpeningJSON(e)}></textarea>
            {createOpening}
        </div>
    )
}

export default CreateOpening;
