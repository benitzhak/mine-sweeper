'use strict'

function buildBoard(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push({
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            })
        }
        mat.push(row)
    }
    return mat
}

function renderBoard(mat, selector) {
    var strHTML = '<table border="1"><tbody>';
    placeMindes(mat);
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            ///// update the model by mine nighbors
            cell.minesAroundCount = setMinesNegsCount(i, j, mat);
            var className = 'cell cell-' + i + '-' + j;
            strHTML += `<td oncontextmenu="cellMarked(this)" onclick="cellClicked(this)" class="${className}">${''}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;


}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}