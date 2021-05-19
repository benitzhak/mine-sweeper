'use strict'
const MINDE = '💥';
const FLAG = '⛳️';

var gMineNum = 2;
var gBoard;
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
    gBoard = buildBoard(gLevel.SIZE, gLevel.SIZE);
    console.table(gBoard);
    renderBoard(gBoard, '.board');
    gGame.isOn = false;
    gGame.shownCount = 0;
    countScore();
}

///// when click on cell
function cellClicked(elCell) {
    gGame.isOn = true;
    if (elCell.classList.contains('marked')) return;
    /////get the class name with the current cell location
    var cellClass = elCell.className;
    /////// make it from string to number
    var cellLocation = getCellCoord(cellClass);
    var currCell = gBoard[cellLocation.i][cellLocation.j];
    if (currCell.isShown) {
        return;
    } else {
        //////// update the model
        currCell.isShown = true;
        ////// update the dom
        elCell.style.backgroundColor = 'white';
        if (currCell.isMine) {
            touchMine(cellLocation.i, cellLocation.j);
        }
        //////// count the neighbors
        var numOfMines = setMinesNegsCount(cellLocation.i, cellLocation.j, gBoard);
        /////// place the num of neighbors at the dom cell
        if (numOfMines > 0 && !currCell.isMine) {
            elCell.innerText = numOfMines;
        }
        if (!currCell.isMine) {
            gGame.shownCount++
                countScore();
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
    ////// update model
    for (var i = 0; i < gMineNum; i++) {
        var idxI = getRandomInt(0, board.length - 1);
        var idxJ = getRandomInt(0, board.length - 1);
        board[idxI][idxJ].isMine = true;
    }
}


function touchMine(idxI, idxJ) {
    var elCell = document.querySelector(`.cell-${idxI}-${idxJ}`);
    if (gBoard[idxI][idxJ].isShown) {
        gBoard[idxI][idxJ].isShown = true;
        elCell.innerText = MINDE;
        elCell.style.backgroundColor = 'red';

    }

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
    if (num === 4) gMineNum = 2;
    if (num === 8) gMineNum = 12;
    if (num === 12) gMineNum = 30;
    init();
}


function cellMarked(elCell) {
    gGame.isOn = true;
    elCell.classList.toggle('marked');
    if (elCell.classList.contains('marked')) {
        elCell.innerText = FLAG;
    } else elCell.innerText = '';
    console.log(elCell);
    window.addEventListener("contextmenu", e => e.preventDefault());
}



function countScore() {
    var elScore = document.querySelector('.score span');
    elScore.innerText = gGame.shownCount;
}