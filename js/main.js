'use strict'
const MINDE = '💥';
const FLAG = '⛳️';
const GAME_OVER = '😢';
const GAME_ON = '😁';
const GAME_WON = '😎';

var gBoard;
var gInterval;
var gTime;
var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}



function init() {
    gGame.isOn = false;
    var elTimer = document.querySelector('.timer span');
    var elBtn = document.querySelector('.game-box .btn button');
    elBtn.innerText = GAME_ON;
    gBoard = buildBoard(gLevel.SIZE, gLevel.SIZE);
    renderBoard(gBoard, '.board');
    countScore(gBoard);
    clearInterval(gInterval);
    gTime = 0;
    gGame.markedCount = 0;
    elTimer.innerText = 0;

}

///// when click on cell
function cellClicked(elCell) {
    var elBtn = document.querySelector('.game-box .btn button');
    if (elBtn.innerText === GAME_OVER) return;
    var cellClass = elCell.className;
    if (elCell.classList.contains('marked')) return;
    /////// make it from string to number
    var cellLocation = getCellCoord(cellClass);
    var currCell = gBoard[cellLocation.i][cellLocation.j];
    //// respond to first click only
    if (!gGame.isOn) {
        setTimer();
        expandShown(elCell, gBoard);
        placeMindes(gBoard);
        firstClickSetMinsNegsCount(elCell, gBoard); /// just for rirst click
        countScore(gBoard);
    }
    gGame.isOn = true;
    ///// all other clicks
    if (currCell.isShown) {
        return;
    } else {
        currCell.isShown = true;
        gBoard.shownCount++
            countScore(gBoard);
        elCell.style.backgroundColor = 'white';
        if (currCell.isMine) {
            touchMine(gBoard);
            gameOver();
        }
        //////// count the neighbors
        var numOfMines = setMinesNegsCount(cellLocation.i, cellLocation.j, gBoard);
        /////// place the num of neighbors at the dom cell
        if (numOfMines > 0 && !currCell.isMine) {
            elCell.innerText = numOfMines;
        }
    }
}

//////// creat a number from the class location
function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}


function placeMindes(board) {
    var x = emptyCells(board);
    for (var i = 0; i < gLevel.MINES; i++) {
        getRandomMinde(x);
    }
}


function getRandomMinde(emptyCells) {
    shuffle(emptyCells);
    var cell = emptyCells.pop();
    cell = gBoard[cell.i][cell.j];
    cell.isMine = true;
    return cell;
}


function touchMine(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) {
                var elMine = document.querySelector(`.cell-${i}-${j}`);
                board[i][j].isShown = true;
                elMine.innerText = MINDE;
                elMine.style.backgroundColor = 'red';
            }
        }
    }
    // var elCell = document.querySelector(`.cell-${idxI}-${idxJ}`);
    // if (gBoard[idxI][idxJ].isShown) {
    //     gBoard[idxI][idxJ].isShown = true;
    //     elCell.innerText = MINDE;
    //     elCell.style.backgroundColor = 'red';
    // }
}


function setMinesNegsCount(cellI, cellJ, mat) {
    var negsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isMine) {
                negsCount++;
            }
        }
    }
    return negsCount;
}


function changeLevel(num) {
    gLevel.SIZE = num;
    if (num === 4) gLevel.MINES = 2;
    if (num === 8) gLevel.MINES = 12;
    if (num === 12) gLevel.MINES = 30;
    init();
}


function cellMarked(elCell) {
    gGame.isOn = true;
    elCell.classList.toggle('marked');
    if (elCell.classList.contains('marked')) {
        elCell.innerText = FLAG;
        gGame.markedCount++
    } else {
        elCell.innerText = '';
        gGame.markedCount--
    }
    checkVictory(gBoard);
    window.addEventListener("contextmenu", e => e.preventDefault());
}


function countScore(board) {
    var elScore = document.querySelector('.score span');
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isShown && !board[i][j].isMine) gGame.shownCount++
        }
    }
    elScore.innerText = gGame.shownCount;
    gGame.shownCount = 0;
}


function gameOver() {
    var elBtn = document.querySelector('.game-box .btn button');
    elBtn.innerText = GAME_OVER;
    gGame.isOn = false;
    clearInterval(gInterval);
}


function checkVictory(board) {
    var elBtn = document.querySelector('.game-box .btn button');
    var countShownCells = 0;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isShown === true) countShownCells++;
            if (countShownCells === (gLevel.SIZE ** 2 - gLevel.MINES) &&
                gGame.markedCount === gLevel.MINES) {
                elBtn.innerText = GAME_WON;
                clearInterval(gInterval);

            }
        }
    }
}


function setTimer() {
    var elTimer = document.querySelector('.timer span');
    gInterval = setInterval(function() {
        gTime++
        elTimer.innerText = gTime;
        checkVictory(gBoard);
    }, 1000);
}


function expandShown(elCell, board) {
    var cellClass = elCell.className;
    /////// make it from string to number
    var cellLocation = getCellCoord(cellClass);
    for (var i = cellLocation.i - 1; i <= cellLocation.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellLocation.j - 1; j <= cellLocation.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            board[i][j].isShown = true;
            var negCell = document.querySelector(`.board .cell-${i}-${j}`);
            negCell.style.backgroundColor = 'white'
        }
    }
}


function firstClickSetMinsNegsCount(elCell, board) {
    var cellClass = elCell.className;
    /////// make it from string to number
    var cellLocation = getCellCoord(cellClass);
    for (var i = cellLocation.i - 1; i <= cellLocation.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellLocation.j - 1; j <= cellLocation.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            board[i][j].isShown = true;
            var negCell = document.querySelector(`.board .cell-${i}-${j}`);
            var numOfMines = setMinesNegsCount(i, j, board);
            /////// place the num of neighbors at the dom cell
            if (numOfMines > 0) {
                negCell.innerText = numOfMines;
            }
        }
    }
}