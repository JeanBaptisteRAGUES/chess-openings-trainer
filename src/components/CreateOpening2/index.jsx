import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {FaChessPawn, FaChessRook, FaChessKnight, FaChessBishop, FaChessQueen, FaChessKing} from 'react-icons/fa';
import {GrPowerCycle} from 'react-icons/gr';
import './createopening2.css';
import { GrPrevious, GrNext } from 'react-icons/gr';

const CreateOpening2 = () => {
    const {opening} = useParams();
    const pieces = [null, <FaChessPawn/>, <FaChessRook/>, <FaChessKnight/>, <FaChessBishop/>, <FaChessQueen/>, <FaChessKing/>];
    const numToLetter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const [pieceInHand, setPieceInHand] = useState([]);
    const [playerTeam, setPlayerTeam] = useState(1);
    const openingData = JSON.parse(localStorage.getItem(opening));
    const [movesList, setMovesList] = useState("moves");
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState("");
    const [boardSetup, setBoardSetup] = useState([[
        [22,23,24,25,26,24,23,22],
        [21,21,21,21,21,21,21,21],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [11,11,11,11,11,11,11,11],
        [12,13,14,15,16,14,13,12]
    ], 0, false]);
    const [caseBlue, setCaseBlue] = useState([null, null]);

    useEffect(() => {
        if(caseBlue[1] !== null){
            //console.log(caseBlue[1]);
            caseBlue[1].classList.add("selected");
        }

        if(caseBlue[0] !== null){
            //console.log(caseBlue[0]);
            caseBlue[0].classList.remove("selected");
        }
    }, [caseBlue]);
    

    const findCaseColor = (indexLine, indexColumn) => {
        return (indexLine+indexColumn) % 2 === 0 ? 'create_whiteCase' : 'create_blackCase';
    }

    const findPieceColor = (boardCase) => {
        return Math.floor(boardCase/10) === 1 ? 'whitePiece' : 'blackPiece';
    }

    const charToCol = (letter) => {
        return  playerTeam === 1 ? letter.charCodeAt(0) - "a".charCodeAt(0) : 7 - (letter.charCodeAt(0) - "a".charCodeAt(0));
    }

    const colToChar = (col) => {
        return playerTeam === 1 ? String.fromCharCode(col + "a".charCodeAt(0)) : String.fromCharCode((7 - col) + "a".charCodeAt(0));
    }

    const charToLig = (charNb) => {
        return  playerTeam === 1 ? 7 - (parseInt(charNb)-1) : parseInt(charNb)-1;
    }

    const ligToChar = (lig) => {
        return playerTeam === 1 ?  (8 - lig) : (lig + 1);
    }

    const tupleToNotation = (tuple) => {
        return (colToChar(tuple[1]) + ligToChar(tuple[0]));
    }

    const findCase = (notation) => {
        //console.log(playerTeam);
        return [charToLig(notation[1]), charToCol(notation[0])];
    }

    const selectRandomVariant = (variantsList) => {
        console.log("variantsList : " + variantsList);
        const rand = Math.floor(Math.random()*variantsList.length);
        //console.log(variantsList[rand]);
        console.log("Random Variant : n°" + rand);
        return variantsList[rand];
    }

    const searchForVariants = (movesList, turn) => {
        let potentialVariants = [movesList];
        //let potentialVariants = [];

        openingData["variantsList"].forEach(variantName => {
            if(JSON.stringify(openingData[variantName].slice(0, turn)) === JSON.stringify(openingData[movesList].slice(0, turn))){
                if(JSON.stringify(openingData[variantName].slice(0, turn+1)) !== JSON.stringify(openingData[movesList].slice(0, turn+1))){
                    potentialVariants.push(variantName);
                    //console.log("base : " + JSON.stringify(openingData[movesList].slice(0, turn+1)));
                    //console.log("variant : " + JSON.stringify(openingData[variantName].slice(0, turn+1)));
                }
            }
        });

        console.log(potentialVariants);
        if(potentialVariants.length > 1) setVariants(potentialVariants);

        return potentialVariants.length > 1;
    }

    const findNextMoves = (newMovesList, newTurn) => {
        if( newTurn >= openingData[newMovesList].length) return [["", ""], -1];
        //if(searchForVariants(newMovesList, newTurn)) return [["", ""], -1];

        console.log("ok_findNextMove");
        let nextMoves = [];
        console.log(openingData[newMovesList][newTurn][1]);

        switch (openingData[newMovesList][newTurn][0]) {
            case "m":
                console.log("case : m");
                nextMoves = openingData[newMovesList][newTurn][1];
                //console.log(openingData[movesList][newTurn][1]);
                return [[nextMoves], newTurn];

            case "c":
                console.log("case : c");
                let castleMove = openingData[newMovesList][newTurn][1];

                if(castleMove[0] === "w"){
                    if(castleMove[1] === "o-o"){
                        return [[["e1", "g1"], ["h1", "f1"]], newTurn];
                    }else{
                        return [[["e1", "c1"], ["a1", "d1"]], newTurn];
                    }
                }else{
                    if(castleMove[1] === "o-o"){
                        return [[["e8", "g8"], ["h8", "f8"]], newTurn];
                    }else{
                        return [[["e8", "c8"], ["a8", "d8"]], newTurn];
                    }
                }

            case "v":
                console.log("case : v");
                /*
                let newMovesList = selectRandomVariant(openingData[movesList][newTurn][1]);
                setMovesList(newMovesList);
                nextMoves = openingData[newMovesList][1][1];
                */
                setVariants(openingData[newMovesList][newTurn][1]);
                return [[nextMoves], -1];
        
            default:
                console.log("Clé inconnue : " + openingData[newMovesList][newTurn][0]);
                break;
        }
    }

    const applyNextMove = (moves) => {
        //console.log(newTurn2 + ": " + [startNotation, endNotation]);
        //console.log("Computer move : ");
        let newBoard = deepCloneArray(boardSetup[0]);
        let startCase = "";
        let endCase = "";
        let piece = "";

        moves.forEach(([startNotation, endNotation]) => {
            //console.log([startNotation, endNotation]);
            startCase = findCase(startNotation);
            endCase = findCase(endNotation);
            piece = newBoard[startCase[0]][startCase[1]];
            newBoard[startCase[0]][startCase[1]] = 0;
            newBoard[endCase[0]][endCase[1]] = piece;
        })

        return newBoard;
    }

    const nextMove = () => {
        if(searchForVariants(movesList, boardSetup[1])) return null;

        let [moves, newTurn2] = findNextMoves(movesList, boardSetup[1]);
        //console.log("move : " + moves);
        if(newTurn2 >= 0){
            let newBoard = applyNextMove(moves, boardSetup[0]);
            setBoardSetup([newBoard, newTurn2+1, false]);
        }else{
            //console.log("Entrainement terminé !");
        }
    }

    const findPreviousMoves = (newTurn) => {
        if( newTurn >= openingData[movesList].length) return [["", ""], -1];
        //console.log("ok_findPreviousMove");
        let nextMoves = [];
        console.log(openingData[movesList][newTurn][0]);

        switch (openingData[movesList][newTurn][0]) {
            case "m":
                console.log("case : m");
                nextMoves = openingData[movesList][newTurn][1];
                //console.log(openingData[movesList][newTurn][1]);
                return [[nextMoves], newTurn];

            case "c":
                console.log("case : c");
                let castleMove = openingData[movesList][newTurn][1];

                if(castleMove[0] === "w"){
                    if(castleMove[1] === "o-o"){
                        return [[["e1", "g1", 0], ["h1", "f1", 0]], newTurn];
                    }else{
                        return [[["e1", "c1", 0], ["a1", "d1", 0]], newTurn];
                    }
                }else{
                    if(castleMove[1] === "o-o"){
                        return [[["e8", "g8", 0], ["h8", "f8", 0]], newTurn];
                    }else{
                        return [[["e8", "c8", 0], ["a8", "d8", 0]], newTurn];
                    }
                }

            case "v":
                console.log("case : v");
                console.log(openingData[movesList][newTurn][1]);
                let newMovesList = selectRandomVariant(openingData[movesList][newTurn][1]);
                console.log("newMovesList : " + newMovesList);
                setMovesList(newMovesList);
                //setTurn(0);
                let newTurn2 = openingData[newMovesList].length - 2;
                nextMoves = openingData[newMovesList][newTurn2][1];
                //console.log(openingData[newMovesList][0][1]);
                return [[nextMoves], newTurn2];
        
            default:
                console.log("Clé inconnue : " + openingData[movesList][newTurn][0]);
                break;
        }
    }

    const applyPreviousMove = (moves) => {
        //console.log(newTurn2 + ": " + [startNotation, endNotation]);
        //console.log("Computer move : ");
        let newBoard = deepCloneArray(boardSetup[0]);
        let startCase = "";
        let endCase = "";
        let piece = "";

        moves.forEach(([startNotation, endNotation, oldPiece]) => {
            //console.log([endNotation, startNotation, oldPiece]);
            startCase = findCase(endNotation);
            endCase = findCase(startNotation);
            piece = newBoard[startCase[0]][startCase[1]];
            newBoard[startCase[0]][startCase[1]] = oldPiece;
            newBoard[endCase[0]][endCase[1]] = piece;
        })

        return newBoard;
    }

    const previousMove = () => {
        let [moves, newTurn2] = findPreviousMoves(boardSetup[1]-1);
        console.log("move : " + moves);
        if(newTurn2 >= 0){
            let newBoard = applyPreviousMove(moves, boardSetup[0]);
            setBoardSetup([newBoard, newTurn2, false]);
        }else{
            console.log("Entrainement terminé !");
        }
    }

    const findNewVariantName = (indice) => {
        if(indice >= 0 && indice < 10) return "v_00" + indice;
        if(indice >= 10 && indice < 100) return "v_0" + indice;
        if(indice >= 100) return "v_" + indice;

        console.log("Erreur valeur indice variant : " + indice);
        return null;
    }

    const addMove = (myMove) => {
        if(boardSetup[1] < (openingData[movesList].length)){
            console.log("Check if create variant : ");

            let variantsList = deepCloneArray(openingData["variantsList"]);
            let variantBase = deepCloneArray(openingData[movesList]).slice(0, boardSetup[1]);
            //let variantNew = variantBase.push(myMove);
            let variantNew = variantBase.concat([myMove]);
            let variantAlreadyExists = false;
            let oldVariant = "";

            //console.log("Variant Base : " + variantBase);
            //console.log("Variant New : " + variantNew);
            
            variantsList.forEach(variantName => {
                if(openingData[variantName].length >= variantNew.length){
                    let variantTest = deepCloneArray(openingData[variantName]).slice(0, boardSetup[1]+1);

                    variantAlreadyExists = variantAlreadyExists || (JSON.stringify(variantNew) === JSON.stringify(variantTest));
                    if(!variantAlreadyExists) console.log("Variant Test : " + variantTest);
                    if(variantAlreadyExists) oldVariant = variantName;
                }
            });

            if(variantAlreadyExists){
                console.log("No need to create a new variant");
                //Problème des fois, ne se branche pas sur le bon variant ou crash au prochain coup
                //Exemple dans l'ouverture "London System" si on rejoue manuellement le fou noir qui prend le fou blanc en g3
                setMovesList(oldVariant);
            }else{
                let newVariantName = findNewVariantName(variantsList.length);
                console.log(`Create a new variant (${newVariantName}) : ` + JSON.stringify(variantNew));
                openingData[newVariantName] = variantNew;
                openingData["variantsList"] = openingData["variantsList"].concat([newVariantName]);
                setMovesList(newVariantName);
                localStorage.setItem(opening, JSON.stringify(openingData));
            }
             
        }else{
            console.log("Add move :");
            openingData[movesList].push(myMove);
            localStorage.setItem(opening, JSON.stringify(openingData));
        }
    }

    const chooseAction = (e, l, c, piece) => {
        //console.log(boardSetup[0].length);
        
        if(piece > 0){
            if(pieceInHand.length > 0){
                if(Math.floor(piece/10) === Math.floor(pieceInHand[1]/10)){
                    if(pieceInHand[0][0] === l && pieceInHand[0][1] === c){
                        setPieceInHand([]);
                        setCaseBlue([caseBlue[1], null]);
                    }else{
                        setPieceInHand([[l, c], piece]);
                        setCaseBlue([caseBlue[1], e.currentTarget]);
                    }
                }else{
                    let newBoard = boardSetup[0];
                    let move = ["m", [tupleToNotation([pieceInHand[0][0], pieceInHand[0][1]]), tupleToNotation([l, c]), piece]];
                    //console.log("ok_take");
                    newBoard[pieceInHand[0][0]][pieceInHand[0][1]] = 0;
                    newBoard[l][c] = pieceInHand[1];
                    setCaseBlue([caseBlue[1], null]);
                    setPieceInHand([]);
                    addMove(move);
                    setBoardSetup([newBoard, boardSetup[1]+1, true]);
                }
            }else{
                setPieceInHand([[l, c], piece]);
                setCaseBlue([caseBlue[1], e.currentTarget]);
                //console.log("Piece in hand : " + piece + ' (' + l + ',' + c + ')');
            }
        }else{
            if(pieceInHand.length > 0){ 
                setCaseBlue([caseBlue[1], null]);               
                let newBoard = deepCloneArray(boardSetup[0]);
                let move = ["m", [tupleToNotation([pieceInHand[0][0], pieceInHand[0][1]]), tupleToNotation([l, c]), piece]];
                //console.log("ok_move");
                newBoard[pieceInHand[0][0]][pieceInHand[0][1]] = 0;
                newBoard[l][c] = pieceInHand[1];
                setPieceInHand([]);
                //console.log(newBoard);
                addMove(move);
                setBoardSetup([newBoard, boardSetup[1]+1, true]);
                
            }else{
                //do nothing
            }
        }
        
    }

    const chessBoard = boardSetup[0].length > 0 && 
        boardSetup[0].map((boardLine, indexLine) => {
            return boardLine.map((boardCase, indexColumn) => {
                return <div 
                            key={8*indexLine+indexColumn} 
                            className={findCaseColor(indexLine, indexColumn)} 
                            onClick={(e) => chooseAction(e, indexLine, indexColumn, boardCase)}
                        >
                        {
                            boardCase > 0 ?
                                <div className="piece">
                                    <div className='pieceBackground'>{pieces[boardCase%10]}</div>
                                    <div className={findPieceColor(boardCase)}>{pieces[boardCase%10]}</div>
                                </div>
                                :
                                null
                        }
                        {
                            playerTeam === 1 ?
                                indexColumn === 0 ? <div className="indexLine">{8-indexLine}</div> : null
                            :
                                indexColumn === 0 ? <div className="indexLine">{indexLine+1}</div> : null
                        }
                        {
                            playerTeam === 1 ?
                                indexLine === 7 ? <div className="indexColumn">{numToLetter[indexColumn]}</div> : null
                            :
                                indexLine === 7 ? <div className="indexColumn">{numToLetter[7-indexColumn]}</div> : null
                        }
                    </div>
            })
        })

    const deepCloneArray = (originArray) => {
        return JSON.parse(JSON.stringify(originArray));
    }

    const switchPlayer = (computerCanPlay) => {
        playerTeam === 1 ? setPlayerTeam(2) : setPlayerTeam(1);
        let newBoard = deepCloneArray(boardSetup[0]);

        boardSetup[0].forEach((l, iL) => {
            l.forEach((c, iC) => {
                newBoard[7-iL][7-iC] = c;
            })
        })
        //console.log(newBoard);
        setBoardSetup([newBoard, boardSetup[1], computerCanPlay]);
        return newBoard;
    }

    const canCastleShort = (team) => {
        if(team === 1){
            if(boardSetup[0][7][5] > 0 || boardSetup[0][7][6] > 0) return false;
            if(boardSetup[0][7][4] !== 16 || boardSetup[0][7][7] !== 12) return false;
        }else{
            if(boardSetup[0][7][1] > 0 || boardSetup[0][7][2] > 0) return false;
            if(boardSetup[0][7][0] !== 22 || boardSetup[0][7][3] !== 26) return false;
        }
        return true;
    }

    const castleShort = (team, computerCanPlay) => {
        //console.log("try castleShort");
        if(!canCastleShort(team)) return null;
        //console.log("canCastleShort");
        const move = ["c", [team === 1 ? "w" : "b", "o-o"]];
        if(team === 1){
            const newBoard = boardSetup[0];
            newBoard[7][4] = 0;
            newBoard[7][6] = 16;
            newBoard[7][7] = 0;
            newBoard[7][5] = 12;
            addMove(move);
            setBoardSetup([newBoard, boardSetup[1]+1, computerCanPlay]);
        }else{
            const newBoard = boardSetup[0];
            newBoard[7][3] = 0;
            newBoard[7][1] = 26;
            newBoard[7][0] = 0;
            newBoard[7][2] = 22;
            addMove(move);
            setBoardSetup([newBoard, boardSetup[1]+1, computerCanPlay]);
        }
    }

    const canCastleLong = (team) => {
        if(team === 1){
            if(boardSetup[0][7][1] > 0 || boardSetup[0][7][2] > 0 || boardSetup[0][7][3] > 0) return false;
            if(boardSetup[0][7][0] !== 12 || boardSetup[0][7][4] !== 16) return false;
        }else{
            if(boardSetup[0][7][4] > 0 || boardSetup[0][7][5] > 0 || boardSetup[0][7][6] > 0) return false;
            if(boardSetup[0][7][3] !== 26 || boardSetup[0][7][7] !== 22) return false;
        }
        return true;
    }

    const castleLong = (team, computerCanPlay) => {
        if(!canCastleLong(team)) return null;
        const move = ["c", [team === 1 ? "w" : "b", "o-o-o"]];
        if(team === 1){
            const newBoard = boardSetup[0];
            newBoard[7][4] = 0;
            newBoard[7][2] = 16;
            newBoard[7][0] = 0;
            newBoard[7][3] = 12;
            //setBoard(newBoard);
            addMove(move);
            setBoardSetup([newBoard, boardSetup[1]+1, computerCanPlay]);
        }else{
            const newBoard = boardSetup[0];
            newBoard[7][3] = 0;
            newBoard[7][5] = 26;
            newBoard[7][7] = 0;
            newBoard[7][4] = 22;
            //setBoard(newBoard);
            addMove(move);
            setBoardSetup([newBoard, boardSetup[1]+1, computerCanPlay]);
        }
    }

    //inutile
    const previous = () => {
        previousMove();
    }

    //inutile
    const next = () => {
        nextMove();
    }

    const displayOpeningData = () => {
        console.log(openingData);
    }

    const testRand = () => {
        let randSum = 0;

        for(let i = 0; i < 1000; i++){
            randSum += Math.floor(Math.random()*1);
        }

        console.log(randSum);
    }

    const variantsDisplay = variants.length > 0 && (
        variants.map(variant => {
            return <option key={variant} value={variant}>{openingData[variant][boardSetup[1]][1][0] + openingData[variant][boardSetup[1]][1][1]}</option>
        })
    )

    const updateVariant = (e) => {
        setSelectedVariant(e.target.value);
    }

    const chooseVariant = () => {
        console.log("Selected variant : " + selectedVariant);
        setMovesList(selectedVariant);
        const nextMoves = findNextMoves(selectedVariant, boardSetup[1])[0];
        console.log("Next Moves : " + nextMoves);
        let newBoard = applyNextMove(nextMoves, boardSetup[0]);
        setBoardSetup([newBoard, boardSetup[1]+1, false]);
        setSelectedVariant("");
        setVariants([]);
    }    

    return (
        <div className="trainingContainer">
            <div className="boardAndMenu">
                <div className="openingTitle" onClick={() => displayOpeningData()}>{openingData['name']}</div>
                <div className="chessBoard">
                    {chessBoard}
                </div>
                <div className="menu">
                    <div className="chooseVariant">
                        <select className="variantSelector" onChange={(e) => updateVariant(e)}>
                            <option value=''>--Choisissez une variante--</option>
                            {variantsDisplay}
                        </select>
                        {
                            selectedVariant !== "" ?
                                <button onClick={() => chooseVariant()}>Choisir</button>
                            :
                            <button className="dimmed">Choisir</button>
                        }
                    </div>
                    <div className="previousNextBtn">
                        {
                            boardSetup[1] > 0 ?
                                <div className="scrollingBtn" onClick={() => previous()}>
                                    <GrPrevious/>
                                </div>
                            :
                                <div className="scrollingBtn dimmed">
                                    <GrPrevious/>
                                </div>
                        }
                        {
                            boardSetup[1] < (openingData[movesList].length) ?
                                <div className="scrollingBtn" onClick={() => next()}>
                                    <GrNext/>
                                </div>
                            :
                                <div className="scrollingBtn dimmed">
                                    <GrNext/>
                                </div>
                        }
                    </div>
                </div>
                {
                    playerTeam === 1 ?
                        <div className="boardBtnBottom">
                            <button className="castleBtn" onClick={() => castleLong(playerTeam, true)}>Castle Long</button>
                            <div className="switchPlayerBtn" onClick={() => switchPlayer()}><GrPowerCycle/></div>
                            <button className="castleBtn" onClick={() => castleShort(playerTeam, true)}>Castle Short</button>
                        </div>
                    :
                        <div className="boardBtnBottom">
                            <button className="castleBtn" onClick={() => castleShort(playerTeam, true)}>Castle Short</button>
                            <div className="switchPlayerBtn" onClick={() => switchPlayer()}><GrPowerCycle/></div>
                            <button className="castleBtn" onClick={() => castleLong(playerTeam, true)}>Castle Long</button>
                        </div>
                }
            </div>
        </div>
    )
}

export default CreateOpening2;
