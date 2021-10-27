import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {FaChessPawn, FaChessRook, FaChessKnight, FaChessBishop, FaChessQueen, FaChessKing} from 'react-icons/fa';
import {GrPowerCycle} from 'react-icons/gr';
import './createpuzzle.css';
import { GrPrevious, GrNext } from 'react-icons/gr';
import { TiDeleteOutline } from 'react-icons/ti';
import { Fragment } from 'react/cjs/react.production.min';
import { Link } from 'react-router-dom';

const CreatePuzzle = () => {
    const {opening} = useParams();
    const openingData = JSON.parse(localStorage.getItem(opening));
    let openingPuzzleId = opening+"Puzzles";
    let openingPuzzle = JSON.parse(localStorage.getItem(openingPuzzleId));

    if(openingPuzzle == null){
        console.log(`Create Puzzle for the opening ${openingData["name"]}`);
        localStorage.setItem(`${opening}Puzzles`, JSON.stringify({"name": openingData["name"] + " Puzzles", "puzzles": []}));
        openingPuzzle = JSON.parse(localStorage.getItem(opening+"Puzzles"));
    }

    console.log(JSON.stringify(openingPuzzle));

    const pieces = [<TiDeleteOutline/>, <FaChessPawn/>, <FaChessRook/>, <FaChessKnight/>, <FaChessBishop/>, <FaChessQueen/>, <FaChessKing/>];
    const numToLetter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const [pieceInHand, setPieceInHand] = useState([]);
    const [playerTeam, setPlayerTeam] = useState(1);
    const [movesList, setMovesList] = useState("moves");
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState("");
    const emptyGrid = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];
    const [boardSetup, setBoardSetup] = useState([emptyGrid, 0, false]);
    const [caseBlue, setCaseBlue] = useState([null, null]);
    const [puzzleMode, setPuzzleMode] = useState('selectPuzzle'); //selectPuzzle, createPuzzleGrid, createPuzzleMoves
    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const [selectedPuzzle, setSelectedPuzzle] = useState(null);
    const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);

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

    useEffect(() => {
        if(puzzleMode === "createPuzzleMoves" && puzzleIndex > 0){
            const puzzleId = openingPuzzle["puzzles"][puzzleIndex-1];
            console.log("Puzzle Name : " + puzzleId);
            console.log("Selected Puzzle : " + JSON.stringify(openingPuzzle[puzzleId]));
            setSelectedPuzzle(openingPuzzle[puzzleId]);
            setSelectedPuzzleId(puzzleId);
        }
    }, [puzzleMode])
    

    const findCaseColor = (indexLine, indexColumn) => {
        return (indexLine+indexColumn) % 2 === 0 ? 'CP_create_whiteCase' : 'CP_create_blackCase';
    }

    const findPieceColor = (boardCase) => {
        return Math.floor(boardCase/10) === 1 ? 'CP_whitePiece' : 'CP_blackPiece';
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

        selectedPuzzle["variantsList"].forEach(variantName => {
            if(JSON.stringify(selectedPuzzle[variantName].slice(0, turn)) === JSON.stringify(selectedPuzzle[movesList].slice(0, turn))){
                if(JSON.stringify(selectedPuzzle[variantName].slice(0, turn+1)) !== JSON.stringify(selectedPuzzle[movesList].slice(0, turn+1))){
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
        if( newTurn >= selectedPuzzle[newMovesList].length) return [["", ""], -1];
        //if(searchForVariants(newMovesList, newTurn)) return [["", ""], -1];

        console.log("ok_findNextMove");
        let nextMoves = [];
        console.log(selectedPuzzle[newMovesList][newTurn][1]);

        switch (selectedPuzzle[newMovesList][newTurn][0]) {
            case "m":
                console.log("case : m");
                nextMoves = selectedPuzzle[newMovesList][newTurn][1];
                //console.log(openingData[movesList][newTurn][1]);
                return [[nextMoves], newTurn];

            case "c":
                console.log("case : c");
                let castleMove = selectedPuzzle[newMovesList][newTurn][1];

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
        
            default:
                console.log("Clé inconnue : " + selectedPuzzle[newMovesList][newTurn][0]);
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
        if( newTurn >= selectedPuzzle[movesList].length) return [["", ""], -1];
        //console.log("ok_findPreviousMove");
        let nextMoves = [];
        console.log(selectedPuzzle[movesList][newTurn][0]);

        switch (selectedPuzzle[movesList][newTurn][0]) {
            case "m":
                console.log("case : m");
                nextMoves = selectedPuzzle[movesList][newTurn][1];
                //console.log(openingData[movesList][newTurn][1]);
                return [[nextMoves], newTurn];

            case "c":
                console.log("case : c");
                let castleMove = selectedPuzzle[movesList][newTurn][1];

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
        
            default:
                console.log("Clé inconnue : " + selectedPuzzle[movesList][newTurn][0]);
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
        if(boardSetup[1] < (selectedPuzzle[movesList].length)){
            console.log("Check if create variant : ");

            let variantsList = deepCloneArray(selectedPuzzle["variantsList"]);
            let variantBase = deepCloneArray(selectedPuzzle[movesList]).slice(0, boardSetup[1]);
            //let variantNew = variantBase.push(myMove);
            let variantNew = variantBase.concat([myMove]);
            let variantAlreadyExists = false;
            let oldVariant = "";

            //console.log("Variant Base : " + variantBase);
            //console.log("Variant New : " + variantNew);
            
            variantsList.forEach(variantName => {
                if(selectedPuzzle[variantName].length >= variantNew.length){
                    let variantTest = deepCloneArray(selectedPuzzle[variantName]).slice(0, boardSetup[1]+1);

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
                selectedPuzzle[newVariantName] = variantNew;
                selectedPuzzle["variantsList"] = selectedPuzzle["variantsList"].concat([newVariantName]);
                openingPuzzle[selectedPuzzleId] = selectedPuzzle;
                setMovesList(newVariantName);
                localStorage.setItem(openingPuzzleId, JSON.stringify(openingPuzzle));
            }
             
        }else{
            console.log("Add move :");
            selectedPuzzle[movesList].push(myMove);
            openingPuzzle[selectedPuzzleId] = selectedPuzzle;
            localStorage.setItem(openingPuzzleId, JSON.stringify(openingPuzzle));
        }
    }

    const createPuzzleMovesAction = (e, l, c, piece) => {
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

    const createPuzzleGridAction = (l, c) => {
        if(pieceInHand.length > 0){               
            let newBoard = deepCloneArray(boardSetup[0]);
            if(l >= 0 && c >= 0) newBoard[l][c] = pieceInHand[1];
            setBoardSetup([newBoard, boardSetup[1], false]);
            
        }else{
            //do nothing
        }
    }

    const chooseAction = (e, l, c, piece) => {
        //console.log(boardSetup[0].length);

        switch (puzzleMode) {
            case "createPuzzleGrid":
                createPuzzleGridAction(l, c);
                break;

            case "createPuzzleMoves":
                createPuzzleMovesAction(e, l, c, piece);
                break;
        
            default:
                break;
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
                                <div className="CP_piece">
                                    <div className='CP_pieceBackground'>{pieces[boardCase%10]}</div>
                                    <div className={findPieceColor(boardCase)}>{pieces[boardCase%10]}</div>
                                </div>
                                :
                                null
                        }
                        {
                            playerTeam === 1 ?
                                indexColumn === 0 ? <div className="CP_indexLine">{8-indexLine}</div> : null
                            :
                                indexColumn === 0 ? <div className="CP_indexLine">{indexLine+1}</div> : null
                        }
                        {
                            playerTeam === 1 ?
                                indexLine === 7 ? <div className="CP_indexColumn">{numToLetter[indexColumn]}</div> : null
                            :
                                indexLine === 7 ? <div className="CP_indexColumn">{numToLetter[7-indexColumn]}</div> : null
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
            return <option key={variant} value={variant}>{selectedPuzzle[variant][boardSetup[1]][1][0] + selectedPuzzle[variant][boardSetup[1]][1][1]}</option>
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

    const pickPieceFromMenu = (piece) => {
        if(piece%10 === 0) piece = 0;
        console.log("Pick piece : " + piece);
        setPieceInHand([[null, null], piece]);
    }

    const blackPiecesMenu = pieces.length > 0 && (
        <div className="CP_piecesMenu">
            {
                pieces.map((piece, i) => {
                    return <div 
                        key={i} 
                        className="CP_create_whiteCase CP_caseBorder" 
                        onClick={() => pickPieceFromMenu(20 + i)}
                    >
                        <div className="CP_piece">
                            <div className="CP_blackPiece">{piece}</div>
                        </div>
                    </div>
                })
            }
        </div>
    )

    const whitePiecesMenu = pieces.length > 0 && (
        <div className="CP_piecesMenu">
            {
                pieces.map((piece, i) => {
                    return <div 
                        key={i} 
                        className="CP_create_blackCase CP_caseBorder" 
                        onClick={() => pickPieceFromMenu(10 + i)}
                    >
                        <div className="CP_piece">
                            <div className="CP_whitePiece">{piece}</div>
                        </div>
                    </div>
                })
            }
        </div>
    )

    const nextPuzzle = () => {
        const newBoard = JSON.parse(openingPuzzle["puzzles"][puzzleIndex]);
        //console.log(newBoard);
        //console.log("Puzzle index : " + (puzzleIndex+1));
        setPuzzleIndex(puzzleIndex+1);
        setBoardSetup([newBoard, 0, false]);
    }

    const previousPuzzle = () => {
        const newBoard = puzzleIndex-1 > 0 ? JSON.parse(openingPuzzle["puzzles"][puzzleIndex-2]) : deepCloneArray(emptyGrid);
        //console.log("Puzzle index : " + (puzzleIndex-1));
        setPuzzleIndex(puzzleIndex-1);
        setBoardSetup([newBoard, 0, false]);
    }

    const savePuzzle = () => {
        console.log("Save Puzzle");
        const newPuzzleGrid = boardSetup[0];
        const newPuzzleGridString = JSON.stringify(newPuzzleGrid);
        openingPuzzle["puzzles"] = openingPuzzle["puzzles"].concat([newPuzzleGridString]);
        openingPuzzle[newPuzzleGridString] = {"playerColor": openingData["playerColor"], "variantsList": ["moves"], "moves": []}
        localStorage.setItem(`${opening}Puzzles`, JSON.stringify(openingPuzzle));
    }

    const resetBoard = () => {
        console.log("Reset Board");
        setBoardSetup([deepCloneArray(emptyGrid), 0, false]);
    }

    const deletePuzzle = () => {
        const puzzleId = openingPuzzle["puzzles"][puzzleIndex-1];
        const newPuzzlesList = openingPuzzle["puzzles"].filter(pID => {
            return pID !== puzzleId;
        });
        openingPuzzle["puzzles"] = newPuzzlesList;
        delete openingPuzzle[puzzleId];
        localStorage.setItem(openingPuzzleId, JSON.stringify(openingPuzzle));
        const newBoard = deepCloneArray(emptyGrid);
        setPuzzleIndex(0);
        setBoardSetup([newBoard, 0, false]);
    }

    const confirmDeletePuzzle = () => {
        if(window.confirm("Voulez-vous vraiment supprimer ce puzzle ?")){
            deletePuzzle();
        }
    }

    const computerPlaysIfWhite = () => {
        if(openingData["playerColor"] === "black" && playerTeam !== 2 && boardSetup[1] === 0){
            switchPlayer(false);
        }
    }

    computerPlaysIfWhite();

    const createPuzzleGridBottomMenu = puzzleMode === "createPuzzleGrid" && (
        <div className="CP_boardBtnBottom">
            <div className="CP_previousNextBtn">
                <button onClick={() => savePuzzle()}>Enregistrer</button>
                <button onClick={() => resetBoard()}>Supprimer</button>
            </div>
        </div>
    )

    const createPuzzleMovesBottomMenu = puzzleMode === "createPuzzleMoves" && (
        playerTeam === 1 ?
            <div className="CP_boardBtnBottom">
                <button className="CP_castleBtn" onClick={() => castleLong(playerTeam, true)}>Castle Long</button>
                <div className="CP_switchPlayerBtn" onClick={() => switchPlayer()}><GrPowerCycle/></div>
                <button className="CP_castleBtn" onClick={() => castleShort(playerTeam, true)}>Castle Short</button>
            </div>
        :
            <div className="CP_boardBtnBottom">
                <button className="CP_castleBtn" onClick={() => castleShort(playerTeam, true)}>Castle Short</button>
                <div className="CP_switchPlayerBtn" onClick={() => switchPlayer()}><GrPowerCycle/></div>
                <button className="CP_castleBtn" onClick={() => castleLong(playerTeam, true)}>Castle Long</button>
            </div>
    )

    const createPuzzleMovesSideMenu = selectedPuzzle !== null && (
        <div className="CP_menu">
            <div className="CP_chooseVariant">
                <select className="CP_variantSelector" onChange={(e) => updateVariant(e)}>
                    <option value=''>--Choisissez une variante--</option>
                    {variantsDisplay}
                </select>
                {
                    selectedVariant !== "" ?
                        <button onClick={() => chooseVariant()}>Choisir</button>
                    :
                    <button className="CP_dimmed">Choisir</button>
                }
            </div>
            <div className="CP_previousNextBtn">
                {
                    boardSetup[1] > 0 ?
                        <div className="CP_scrollingBtn" onClick={() => previous()}>
                            <GrPrevious/>
                        </div>
                    :
                        <div className="CP_scrollingBtn CP_dimmed">
                            <GrPrevious/>
                        </div>
                }
                {
                    boardSetup[1] < (selectedPuzzle[movesList].length) ?
                        <div className="CP_scrollingBtn" onClick={() => next()}>
                            <GrNext/>
                        </div>
                    :
                        <div className="CP_scrollingBtn CP_dimmed">
                            <GrNext/>
                        </div>
                }
            </div>
        </div>
    )

    const selectPuzzleBottomMenu = puzzleMode === "selectPuzzle" && (
        <div className="CP_boardBtnBottom">
            <div className="CP_previousNextBtn">
                    {
                        puzzleIndex > 0 ?
                            <div className="CP_scrollingBtn" onClick={() => previousPuzzle()}>
                                <GrPrevious/>
                            </div>
                        :
                            <div className="CP_scrollingBtn CP_dimmed">
                                <GrPrevious/>
                            </div>
                    }
                    {
                        puzzleIndex === 0 ? 
                            <button onClick={() => setPuzzleMode("createPuzzleGrid")}>Nouveau</button>
                        :
                            <Fragment>
                                <button onClick={() => setPuzzleMode("createPuzzleMoves")}>Définir les coups</button>
                                <button onClick={() => confirmDeletePuzzle()}>Supprimer</button>
                                <Link to={'/resolvepuzzle/' + openingPuzzleId + '/' + (puzzleIndex-1) + '/' + false} className="CP_linkBtn">Jouer</Link>
                            </Fragment>
                    }
                    {
                        puzzleIndex < (openingPuzzle["puzzles"].length) ?
                            <div className="CP_scrollingBtn" onClick={() => nextPuzzle()}>
                                <GrNext/>
                            </div>
                        :
                            <div className="CP_scrollingBtn CP_dimmed">
                                <GrNext/>
                            </div>
                    }
                </div>
        </div>
    )

    return (
        <div className="CP_trainingContainer">
            <div className="CP_boardAndMenu">
                <div className="CP_openingTitle" onClick={() => displayOpeningData()}>{openingData["name"] + " Puzzles"}</div>
                <div className="CP_boardUI">
                    {puzzleMode === "createPuzzleGrid" ? blackPiecesMenu : null}
                    <div className="CP_chessBoard">
                        {chessBoard}
                    </div>
                    {puzzleMode === "createPuzzleGrid" ? whitePiecesMenu : null}
                </div>
                {selectPuzzleBottomMenu}
                {createPuzzleGridBottomMenu}
                {createPuzzleMovesSideMenu}
                {createPuzzleMovesBottomMenu}
            </div>
        </div>
    )
}

export default CreatePuzzle;
