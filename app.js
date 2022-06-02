const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');

let wordle;

// fetching random word from api
const getWordle = () => {
    fetch('http://localhost:5000/word')
        .then(response => response.json())
        .then(data => {
            wordle = data.toUpperCase();
        })
        .catch(error => console.log(error));
};

getWordle();


const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«',
];


const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);
    guessRow.forEach((_guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
        tileElement.classList.add('tile');
        rowElement.append(tileElement);
    })
    tileDisplay.append(rowElement);
});

keys.forEach(key => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = key;
    buttonElement.setAttribute('id', key);
    buttonElement.addEventListener('click', () => {
        handleClick(key)
    });
    keyboard.append(buttonElement);
});

const handleClick = (letter) => {
   // console.log('clicked', letter);
    if(!isGameOver) {
        if (letter === '«') {
            // console.log('delete letter');
             deleteLetter();
            // console.log('guessRows', guessRows);
             return;
         }
     
         if (letter === 'ENTER') {
             checkRow();
            // console.log('guessRows', guessRows);
             return;
         }
         addLetter(letter);
        // console.log('guessRows', guessRows);
    };
};

// add letter function
const addLetter = (letter) => {
    if (currentRow < 6 && currentTile < 5) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = letter;
        guessRows[currentRow][currentTile] = letter;
        tile.setAttribute('data', letter);
        currentTile++;
    }
};

// delete letter function
const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = '';
        guessRows[currentRow][currentTile] = '';
        tile.setAttribute('data', '');
    }
};

// check guessed word function
const checkRow = () => {
    const guessedWord = guessRows[currentRow].join(''); // joining the letters of the row to form a string

    if(currentTile <= 4) {
        showMessage(`All boxes aren't filled!`);
    }

    if (currentTile > 4) {

        //console.log('Word guessed is ' + guessedWord, 'Actual word is ' + wordle);

        flipTile();

        if (guessedWord === wordle) {
            setTimeout(()=>{showMessage(`Excellent!! You got that in ${currentRow+1} attempts`)}, 3000);
            isGameOver = true;
            return;
        } else {
            if (currentRow >= 5) {
                isGameOver = true;
                setTimeout(()=>{showMessage(`Game over!! Word was '${wordle}'`)}, 3000);
                return;
            }

            if (currentRow < 5) {
                currentRow++;
                currentTile = 0;
            }
        }
    }
};

const showMessage = (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageDisplay.append(messageElement);
    setTimeout(() => messageDisplay.removeChild(messageElement), 2000);
};

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter);
    key.classList.add(color);
};

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
    let checkWordle = wordle;
    const guess = [];

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'});
    })

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay';
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay';
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(guess[index].color);
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index);
    });
};
