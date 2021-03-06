import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './resolvePuzzle.css';
import {FaChessPawn, FaChessRook, FaChessKnight, FaChessBishop, FaChessQueen, FaChessKing} from 'react-icons/fa';
import {GrPowerCycle} from 'react-icons/gr';
import {BsQuestionCircle} from 'react-icons/bs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Link } from 'react-router-dom';

toast.configure();

const ResolvePuzzle = () => {
    let puzzles = useParams()["puzzlesList"]; //ex: ../londonSystemPuzzles
    let puzzleIndex = useParams()["puzzleIndex"]; //ex: ../londonSystemPuzzles/2
    let isRandom = useParams()["isRandom"];
    //if(puzzleIndex < 0) [puzzles, puzzleIndex] = selectRandomPuzzle();
    const pieces = [null, <FaChessPawn/>, <FaChessRook/>, <FaChessKnight/>, <FaChessBishop/>, <FaChessQueen/>, <FaChessKing/>];
    const numToLetter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const [pieceInHand, setPieceInHand] = useState([]);
    const openingPuzzles = JSON.parse(localStorage.getItem(puzzles))
    const puzzleId = openingPuzzles["puzzles"][puzzleIndex];
    const openingData = openingPuzzles[puzzleId];
    const startingGrid = JSON.parse(puzzleId);
    /*
    console.log("Opening Puzzles : " + JSON.stringify(openingPuzzles));
    console.log("Puzzle ID : " + puzzleId);
    console.log("Opening Data : " + JSON.stringify(openingData));
    console.log("Starting Grid : " + startingGrid);
    */
    const [playerTeam, setPlayerTeam] = useState(openingData["playerColor"] === "white" ? 1 : 2);
    const [boardSetup, setBoardSetup] = useState([startingGrid, 0, false, "moves"]);
    const [caseBlue, setCaseBlue] = useState([null, null]);
    const [indicationsCount, setIndicationsCount] = useState(0);
    const [nextRandPuzzle, setNextRandPuzzle ] = useState([null, null]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        if(caseBlue[1] !== null){
            caseBlue[1].classList.add("selected");
        }

        if(caseBlue[0] !== null){
            caseBlue[0].classList.remove("selected");
        }
    }, [caseBlue]);

    
    useEffect(() => {
        if(boardSetup[2]) computerPlay();
        //computerPlaysIfWhite();
    }, [boardSetup]);

    useEffect(() => {
        setReload(false);
        if(reload) window.location.reload();
    }, [reload]);

    const showGoodMove = () => {
        toast.success('Bon coup !', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false
        })
    }

    const showBadMove = () => {
        toast.error('Mauvais coup..', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false
        })
    }

    const displayMoveIndication = () => {
        //let nextMove = openingData[movesList][boardSetup[1]];
        let nextMove = openingData[boardSetup[3]][boardSetup[1]];
        let indications = "";

        if(nextMove[0] === 'c'){
            indications = nextMove[1][1] === 'o-o' ? "petit roque" : "grand roque";
        }else{
            indications = "votre pi??ce en " + nextMove[1][0];
        }

        setIndicationsCount(indicationsCount + 1);

        showMoveIndication(indications);
    }

    const showMoveIndication = (indications) => {
        toast.info('Essayez de jouer ' + indications, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false
        })
    }

    const showTrainingEnd = () => {
        toast.success('Entrainement Termin?? !', {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false
        })
    }
    

    const findCaseColor = (indexLine, indexColumn) => {
        return (indexLine+indexColumn) % 2 === 0 ? 'RP_training_whiteCase' : 'RP_training_blackCase';
    }

    const findPieceColor = (boardCase) => {
        return Math.floor(boardCase/10) === 1 ? 'RP_whitePiece' : 'RP_blackPiece';
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
        console.log("findCase notation : " + notation);
        return [charToLig(notation[1]), charToCol(notation[0])];
    }

    const selectRandomVariant = (variantsList) => {
        if(variantsList.length < 1) return [];
        const rand = Math.floor(Math.random()*variantsList.length);
        console.log(variantsList[rand]);
        return variantsList[rand];
    }

    const findCastleMoves = (castleNotation, newTurn) => {
        if(castleNotation[0] === "w"){
            if(castleNotation[1] === "o-o"){
                return [[["e1", "g1"], ["h1", "f1"]], newTurn];
            }else{
                return [[["e1", "c1"], ["a1", "d1"]], newTurn];
            }
        }else{
            if(castleNotation[1] === "o-o"){
                return [[["e8", "g8"], ["h8", "f8"]], newTurn];
            }else{
                return [[["e8", "c8"], ["a8", "d8"]], newTurn];
            }
        }
    }

    const computerFindNextMoves = (newTurn) => {
        let movesList = searchForVariants(boardSetup[3], boardSetup[1]);
        if( movesList.length < 1) return [["", ""], -1];
        console.log("ok_findNextMove");
        let nextMoves = [];
        console.log(openingData[movesList][newTurn][0]);

        switch (openingData[movesList][newTurn][0]) {
            case "m":
                console.log("case : m");
                nextMoves = openingData[movesList][newTurn][1];
                console.log(openingData[movesList][newTurn][1]);
                return [[nextMoves], newTurn, movesList];

            case "c":
                console.log("case : c");
                let castleNotation = openingData[movesList][newTurn][1];

                return findCastleMoves(castleNotation, newTurn).concat([movesList]);
        
            default:
                console.log("Cl?? inconnue : " + openingData[movesList][newTurn][0]);
                break;
        }
    }

    const computerMove = (moves) => {
        //console.log(newTurn2 + ": " + [startNotation, endNotation]);
        console.log("Computer move : ");
        let newBoard = deepCloneArray(boardSetup[0]);
        let startCase = "";
        let endCase = "";
        let piece = "";

        moves.forEach(([startNotation, endNotation]) => {
            console.log([startNotation, endNotation]);
            startCase = findCase(startNotation);
            endCase = findCase(endNotation);
            piece = newBoard[startCase[0]][startCase[1]];
            newBoard[startCase[0]][startCase[1]] = 0;
            newBoard[endCase[0]][endCase[1]] = piece;
        })

        return newBoard;
    }

    const selectRandomPuzzle = (myOpening = null) => {
        let randOpening = null;
        let randOpeningIndex = null;
        let randOpeningID = myOpening;
        let incr = 0;
        const openingsList = JSON.parse(localStorage.getItem("openingsList"));
        
        if(randOpeningID !== null) randOpening = JSON.parse(localStorage.getItem(randOpeningID));
        while(randOpening === null){
            if(incr > 200){
                alert("Erreur !");
                return null;
            }
            randOpeningIndex = Math.floor(Math.random()*openingsList["openings"].length);
            //console.log("Rand Opening Index : " + randOpeningIndex);
            randOpeningID = openingsList["openings"][randOpeningIndex][0] + "Puzzles";
            //console.log("Rand Opening : " + randOpening);
            randOpening = JSON.parse(localStorage.getItem(randOpeningID));
            incr++;
        }
        console.log("Rand Opening ID : " + randOpeningID);

        const randOpeningPuzzlesList = randOpening["puzzles"];
        const randOpeningPuzzlesIndex = Math.floor(Math.random()*randOpeningPuzzlesList.length);

        return [randOpeningID, randOpeningPuzzlesIndex];
    }

    const findNextPuzzles = () => {
        if(isRandom === "true"){
            console.log("Random !");
            setNextRandPuzzle(selectRandomPuzzle());
        }else{
            console.log("Not random !");
            setNextRandPuzzle(selectRandomPuzzle(puzzles));
        }
    }

    const computerPlay = () => {
        console.log("computer plays turn " + boardSetup[1]);
        //setComputerCanPlay(false);
        let [moves, newTurn2, newMoveList] = computerFindNextMoves(boardSetup[1]);
        console.log("move : " + moves);
        if(newTurn2 >= 0){
            let newBoard = computerMove(moves, boardSetup[0]);
            setBoardSetup([newBoard, newTurn2+1, false, newMoveList]);
        }else{
            console.log("Entrainement termin?? !");
            showTrainingEnd();
            findNextPuzzles();
        }
    }

    const searchForVariants = (movesList, turn) => {
        //let potentialVariants = [movesList];
        let potentialVariants = [];

        openingData["variantsList"].forEach(variantName => {
            //+length pour voir si on prend pas un variant fini
            if(openingData[variantName].length > turn){
                if(JSON.stringify(openingData[variantName].slice(0, turn)) === JSON.stringify(openingData[movesList].slice(0, turn))){
                    potentialVariants.push(variantName);
                }
            }
        });

        console.log("Potential variants : " + potentialVariants);
        

        return selectRandomVariant(potentialVariants);
    }

    const checkMoveValidity = (myMove) => {
        console.log("Check move validity of : " + myMove);
        //console.log("Good move reference : " + goodMove);
        let movesList = boardSetup[3];
        let result = [false, movesList, boardSetup[1]];

        openingData["variantsList"].forEach(variantName => {
            if(JSON.stringify(openingData[variantName].slice(0, boardSetup[1])) === JSON.stringify(openingData[movesList].slice(0, boardSetup[1]))){
                if(JSON.stringify(myMove) === JSON.stringify(openingData[variantName][boardSetup[1]])){
                    movesList = variantName;
                    result =  [true, movesList, boardSetup[1]];
                }else{
                    console.log("My move : " + JSON.stringify(myMove));
                    console.log("Test move : " + JSON.stringify(openingData[variantName][boardSetup[1]]));
                }
            }else{
                console.log("Variant base : " + JSON.stringify(openingData[variantName].slice(0, boardSetup[1])));
                console.log("MovesList base : " + JSON.stringify(openingData[movesList].slice(0, boardSetup[1])));
            }
        })

        

        /*
        if(goodMove[0] !== 'v'){
            if(myMove[0] !== goodMove[0]) return [false, movesList, boardSetup[1]];
            if(myMove[1][0] !== goodMove[1][0] || myMove[1][1] !== goodMove[1][1]) return [false, movesList, boardSetup[1]];
            result =  [true, movesList, boardSetup[1]];
        }else{
            console.log("goodMove[1] : " + goodMove[1]);
            goodMove[1].forEach(variant => {
                console.log("Variant : " + variant);
                console.log(`openingData[${variant}][1] : ` + openingData[variant][1]);
                let newGoodMove = openingData[variant][1];
                //if(checkMoveValidity(myMove, newGoodMove)) return [true, variant, 2];
                if(myMove[0] === newGoodMove[0] && (myMove[1][0] === newGoodMove[1][0] && myMove[1][1] === newGoodMove[1][1])){
                    console.log("Valid variant : " + variant);
                    result =  [true, variant, 1];
                }else{
                    console.log("myMove : " + myMove);
                    console.log("newGoodMove : " + newGoodMove);
                }
            });
        }
        */
        return result;
    }

    const chooseAction = (e, l, c, piece) => {
        //console.log(boardSetup[0].length);
        let movesList = boardSetup[3];

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
                    //console.log("Move : " + pieceInHand[1] + ' (' + pieceInHand[0][0] + ',' + pieceInHand[0][1] + ') to (' + l + ',' + c + ')');
                    let newBoard = boardSetup[0];
                    //console.log(openings[opening][movesList]);
                    let move = ["m", [tupleToNotation([pieceInHand[0][0], pieceInHand[0][1]]), tupleToNotation([l, c]), piece]];
                    console.log("Check Move Validity : " + checkMoveValidity(move));
                    let [moveValidity, variant, turn] = checkMoveValidity(move);
                    if(moveValidity){
                        console.log("ok_take");
                        showGoodMove();
                        newBoard[pieceInHand[0][0]][pieceInHand[0][1]] = 0;
                        newBoard[l][c] = pieceInHand[1];
                        setPieceInHand([]);
                        setCaseBlue([caseBlue[1], null]);
                        //setMovesList(variant);
                        setBoardSetup([newBoard, turn+1, true, variant]);
                    }else{
                        console.log("Mauvais coup !");
                        showBadMove();
                        console.log(tupleToNotation([pieceInHand[0][0], pieceInHand[0][1]]) + " VS " + openingData[movesList][boardSetup[1]][1][0]);
                        console.log(tupleToNotation([l, c]) + " VS " + openingData[movesList][boardSetup[1]][1][1]);
                        setPieceInHand([]);
                        setCaseBlue([caseBlue[1], null]);
                    }
                }
            }else{
                setPieceInHand([[l, c], piece]);
                setCaseBlue([caseBlue[1], e.currentTarget]);
                console.log("Piece in hand : " + piece + ' (' + l + ',' + c + ')');
            }
        }else{
            if(pieceInHand.length > 0){
                //console.log("Move : " + pieceInHand[1] + ' (' + pieceInHand[0][0] + ',' + pieceInHand[0][1] + ') to (' + l + ',' + c + ')');
                
                let newBoard = deepCloneArray(boardSetup[0]);
                //console.log(openings[opening][movesList]);
                let move = ["m", [tupleToNotation([pieceInHand[0][0], pieceInHand[0][1]]), tupleToNotation([l, c]), piece]];
                console.log("Check Move Validity : " + checkMoveValidity(move));
                let [moveValidity, variant, turn] = checkMoveValidity(move);
                if(moveValidity){
                    console.log("ok_move");
                    showGoodMove();
                    newBoard[pieceInHand[0][0]][pieceInHand[0][1]] = 0;
                    newBoard[l][c] = pieceInHand[1];
                    setPieceInHand([]);
                    //setMovesList(variant);
                    setBoardSetup([newBoard, turn+1, true, variant]);
                }else{
                    console.log("Mauvais coup !");
                    showBadMove();
                    console.log(tupleToNotation([pieceInHand[0][0], pieceInHand[0][1]]) + " VS " + openingData[movesList][boardSetup[1]][1][0]);
                    console.log(tupleToNotation([l, c]) + " VS " + openingData[movesList][boardSetup[1]][1][1]);
                    setPieceInHand([]);
                }
                setCaseBlue([caseBlue[1], null]);
                
            }else{
                //do nothing
            }
        }
        
    }

    const chessBoard = boardSetup[0].length > 0 && 
        boardSetup[0].map((boardLine, indexLine) => {
            //console.log(Object.entries(boardLine));
            return boardLine.map((boardCase, indexColumn) => {
                return <div 
                            key={8*indexLine+indexColumn} 
                            className={findCaseColor(indexLine, indexColumn)} 
                            onClick={(e) => chooseAction(e, indexLine, indexColumn, boardCase)}
                        >
                        {
                            boardCase > 0 ?
                                <div className="RP_piece">
                                    <div className='RP_pieceBackground'>{pieces[boardCase%10]}</div>
                                    <div className={findPieceColor(boardCase)}>{pieces[boardCase%10]}</div>
                                </div>
                                :
                                null
                        }
                        {
                            playerTeam === 1 ?
                                indexColumn === 0 ? <div className="RP_indexLine">{8-indexLine}</div> : null
                            :
                                indexColumn === 0 ? <div className="RP_indexLine">{indexLine+1}</div> : null
                        }
                        {
                            playerTeam === 1 ?
                                indexLine === 7 ? <div className="RP_indexColumn">{numToLetter[indexColumn]}</div> : null
                            :
                                indexLine === 7 ? <div className="RP_indexColumn">{numToLetter[7-indexColumn]}</div> : null
                        }
                    </div>
            })
        })

    const deepCloneArray = (originArray) => {
        return JSON.parse(JSON.stringify(originArray));
        //return __dirname.cloneDeep(originArray);
    }

    const switchPlayer = (computerCanPlay) => {
        playerTeam === 1 ? setPlayerTeam(2) : setPlayerTeam(1);
        let newBoard = deepCloneArray(boardSetup[0]);

        boardSetup[0].forEach((l, iL) => {
            l.forEach((c, iC) => {
                newBoard[7-iL][7-iC] = c;
            })
        })
        console.log(newBoard);
        //setBoard(newBoard);
        setBoardSetup([newBoard, boardSetup[1], computerCanPlay, boardSetup[3]]);
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
        console.log("try castleShort");
        let movesList = boardSetup[3];
        if(!canCastleShort(team)) return null;
        console.log("canCastleShort");
        const move = ["c", [team === 1 ? "w" : "b", "o-o"]];
        let [moveValidity, variant, turn] = checkMoveValidity(move, openingData[movesList][boardSetup[1]]);
        if(moveValidity){
            console.log("Castle Short is a valid move");
            const newBoard = boardSetup[0];
            if(team === 1){
                newBoard[7][4] = 0;
                newBoard[7][6] = 16;
                newBoard[7][7] = 0;
                newBoard[7][5] = 12;
            }else{
                newBoard[7][3] = 0;
                newBoard[7][1] = 26;
                newBoard[7][0] = 0;
                newBoard[7][2] = 22;
            }
            //setMovesList(variant);
            setBoardSetup([newBoard, turn+1, computerCanPlay, variant]);
            showGoodMove();
        }else{
            console.log("Mauvais coup !");
            showBadMove();
            console.log(move);
            console.log(openingData[movesList][boardSetup[1]]);
        }
    }

    const canCastleLong = (team) => {
        console.log("Team : " + team);
        if(team === 1){
            console.log("Check Castle Long whites :");
            if(boardSetup[0][7][1] > 0 || boardSetup[0][7][2] > 0 || boardSetup[0][7][3] > 0) return false;
            console.log("No Blocking pieces");
            if(boardSetup[0][7][0] !== 12 || boardSetup[0][7][4] !== 16) return false;
            console.log("Rook and King at the right place");
        }else{
            if(boardSetup[0][7][4] > 0 || boardSetup[0][7][5] > 0 || boardSetup[0][7][6] > 0) return false;
            if(boardSetup[0][7][3] !== 26 || boardSetup[0][7][7] !== 22) return false;
        }
        return true;
    }

    const castleLong = (team, computerCanPlay) => {
        console.log("try castleLong");
        let movesList = boardSetup[3];
        if(!canCastleLong(team)) return null;
        console.log("canCastleLong");
        const move = ["c", [team === 1 ? "w" : "b", "o-o-o"]];
        let [moveValidity, variant, turn] = checkMoveValidity(move, openingData[movesList][boardSetup[1]]);
        if(moveValidity){
            console.log("Castle Long is a valid move");
            const newBoard = boardSetup[0];
            if(team === 1){
                newBoard[7][4] = 0;
                newBoard[7][2] = 16;
                newBoard[7][0] = 0;
                newBoard[7][3] = 12;
            }else{
                newBoard[7][3] = 0;
                newBoard[7][5] = 26;
                newBoard[7][7] = 0;
                newBoard[7][4] = 22;
            }
            //setMovesList(variant);
            setBoardSetup([newBoard, turn+1, computerCanPlay, variant]);
            showGoodMove();
        }else{
            console.log("Mauvais coup !");
            showBadMove();
            console.log(move);
            console.log(openingData[movesList][boardSetup[1]]);
        }
    }

    const computerPlaysIfWhite = () => {
        if(openingData["playerColor"] === "black" && playerTeam !== 2 && boardSetup[1] === 0){
            switchPlayer(false);
        }
    }

    const updateChessboard = () => {
        let newboard = boardSetup[0];
        newboard[0][4] = 16;
        newboard[7][4] = 26;
        setBoardSetup([newboard, boardSetup[1]+1, true, boardSetup[3]]);
    }

    return (
        <div className="RP_trainingContainer">
            <div className="RP_boardAndMenu">
                <div className="RP_openingTitle">{openingPuzzles["name"]}</div>
                <div className="RP_chessBoard">
                    {chessBoard}
                </div>
                <div className="RP_menu">
                    <BsQuestionCircle className="RP_moveIndicator" onClick={() => displayMoveIndication()}/>
                    <button onClick={() => window.location.reload()}>Rejouer</button>
                    {nextRandPuzzle[0] !== null ? <Link 
                                                    to={'/resolvepuzzle/' + nextRandPuzzle[0] + '/' + nextRandPuzzle[1] + '/' + isRandom}
                                                    onClick={() => setReload(true)}
                                                    >Nouveau Puzzle</Link> : null}
                </div>
                {
                        playerTeam === 1 ?
                            <div className="RP_boardBtnBottom">
                                <button onClick={() => castleLong(playerTeam, true)}>Castle Long</button>
                                <div className="RP_switchPlayerBtn" onClick={() => switchPlayer()}><GrPowerCycle/></div>
                                <button onClick={() => castleShort(playerTeam, true)}>Castle Short</button>
                            </div>
                        :
                            <div className="RP_boardBtnBottom">
                                <button onClick={() => castleShort(playerTeam, true)}>Castle Short</button>
                                <div className="RP_switchPlayerBtn" onClick={() => switchPlayer()}><GrPowerCycle/></div>
                                <button onClick={() => castleLong(playerTeam, true)}>Castle Long</button>
                            </div>
                }
            </div>
        </div>
    )
}

export default ResolvePuzzle;
