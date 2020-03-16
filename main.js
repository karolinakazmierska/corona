function setupGame() {
    const audio = document.querySelector('#audio')
    const cellsXcells = 20
    let ship = 389
    const totalGrid = cellsXcells * cellsXcells
    const board = document.querySelector('.board')
    const cells = [];
    const invaders = [7, 9, 11, 13, 26, 28, 30, 32, 34, 47, 49, 51, 53]
    const rightWall = [19, 39, 59, 79, 99, 119, 139, 159, 179, 199, 219, 239, 259, 279, 299, 319, 339, 359]
    const leftWall = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340]
    let alienDirection = 'right'
    let life = 3
    const invaderMove = 1
    const sidePanel = document.querySelector('.sidePanel')
    const getLifes = Array.from(document.querySelectorAll('.cellLifes'))
    let invadersMovement
    let generateBomb

    // `Creating the board`
    for (let i = 0; i < totalGrid; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        board.appendChild(cell);
        cells.push(cell);
    }

    let start = true
    const music = document.querySelector('#music')
    const startScreen = document.querySelector('.startScreen')
    const letsGo = document.querySelector('#letsGo')
    const counter = document.querySelector('.counter')
    let timer = 4

    // Hiding previous screens
    board.classList.add('hiddenElement');
    sidePanel.classList.add('hiddenElement');
    counter.classList.add('hiddenElement');

    // On Let's Go clicked - activating countdown
    letsGo.addEventListener('click', () => {
        const IntervalID = setInterval(() => {
            if ( timer === 0) {
                // Hiding start screen, counter, showing board and sidePanel
                clearInterval(IntervalID)
                board.classList.remove('hiddenElement')
                sidePanel.classList.remove('hiddenElement')
                startScreen.classList.add('hiddenElement')
                counter.classList.add('hiddenElement');
                gameStart()
            } else {
                startScreen.classList.add('hiddenElement');
                counter.classList.remove('hiddenElement')
                timer -= 1
                counter.innerHTML = timer
            }
        }, 1000)
    })

    // START
    function gameStart() {
        music.src = 'assets/cumbia.mp3' // Change for coronavirus song
        music.play();
        music.loop = true;
        if (start === true) {
            start = false

            // Invaders movement
            invadersMovement = setInterval(() => {
                for (let i = 0; i < invaders.length; i++) {
                    if (invaders[i] > 380 ){
                        clearInterval(invadersMovement)
                        clearInterval(generateBomb)
                        board.style.display = 'none'
                        sidePanel.style.display = 'none'
                        // audio.src = 'assets/gameOver.mp3'
                        // audio.play()
                        // music.pause()
                        gameOver.classList.remove('hiddenElement')
                    }
                    if (alienDirection === 'right') {
                        if (rightWall.includes(invaders[i])) {
                            for (let i = invaders.length - 1; i >= 0; i--) {
                                cells[invaders[i]].classList.remove('invader')
                                invaders[i] += cellsXcells
                                cells[invaders[i]].classList.add('invader')
                            }
                            return alienDirection = 'left'
                        } else {
                            cells[invaders[i]].classList.remove('invader')
                            invaders[i] += invaderMove
                            cells[invaders[i]].classList.add('invader')
                        }
                    } else if (alienDirection === 'left') {
                        if (leftWall.includes(invaders[i])) {
                            for (let i = 0; i < invaders.length; i++) {
                                cells[invaders[i]].classList.remove('invader')
                            }
                            for (let i = 0; i < invaders.length; i++) {
                                invaders[i] += cellsXcells
                                cells[invaders[i]].classList.add('invader')
                            }
                            alienDirection = 'right'
                        } else {
                            cells[invaders[i]].classList.remove('invader')
                            invaders[i] -= invaderMove
                            cells[invaders[i]].classList.add('invader')
                        }
                    }
                }
            }, 300)

            const gameOver = document.querySelector('.gameOver')

            // Generating bombs
            generateBomb = setInterval(() => {
                let bomb = 0
                const invaderFront = invaders.slice(-4)
                const nuke = (Math.floor(Math.random() * invaderFront.length))
                bomb = invaderFront[nuke] += cellsXcells
                audio.src = 'assets/rocket.mp3'
                audio.play()

                const dropBombInterval = setInterval(() => {
                    if (bomb >= 380) {
                        cells[bomb].classList.remove('bomb')
                        clearInterval(dropBombInterval)
                    } else {
                        cells[bomb].classList.remove('bomb')
                        bomb += cellsXcells
                        cells[bomb].classList.add('bomb')
                    }

                    if (ship === bomb) {
                        cells[bomb].classList.remove('bomb')
                        cells[ship].classList.remove('ship')
                        ship = 389
                        cells[ship].classList.add('ship')
                        life -= 1
                        audio.src = 'assets/explosion.mp3'
                        audio.play()
                        getLifes[life].classList.remove('soapLife')
                        console.log("HERE:", getLifes[life]);

                        // Game over, run out of lives
                        if (life === 0) {
                            clearInterval(dropBombInterval)
                            clearInterval(generateBomb)
                            board.style.display = 'none'
                            sidePanel.style.display = 'none'
                            music.pause()
                            // audio.src = 'assets/gameOver.mp3'
                            // audio.play()
                            gameOver.classList.remove('hiddenElement')
                        }
                    }

                }, 200)
            }, 2000)
            cells[ship].classList.add('ship')

            // Ship movements
            document.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowRight') {
                    if (ship === cells.length - 1) {
                        return
                    }
                    cells[ship].classList.remove('ship')
                    ship += 1
                    cells[ship].classList.add('ship')
                } else if (event.key === 'ArrowLeft') {
                    if (ship === 380) {
                        return
                    }
                    cells[ship].classList.remove('ship')
                    ship -= 1
                    cells[ship].classList.add('ship')
                } else if (event.code === 'Space') {
                    shoot()
                    audio.src = 'assets/laser.mp3'
                    audio.play()
                }
            })
        }
    }

    const endGame = document.querySelector('.winner');

    // Shooting
    function shoot() {
        let shoots = 0
        shoots = ship - cellsXcells
        cells[shoots].classList.add('shoot')

        const shootsMovement = setInterval(() => {
            if (invaders.length === 0){
                clearInterval(shootsMovement)
                board.style.display = 'none'
                sidePanel.style.display = 'none'
                endGame.classList.remove('hiddenElement');
                clearInterval(invadersMovement)
                clearInterval(generateBomb)
            } else if (shoots <= 19) {
                clearInterval(shootsMovement)
                cells[shoots].classList.remove('shoot')
            } else {
                cells[shoots].classList.remove('shoot')
                shoots -= 20
                cells[shoots].classList.add('shoot')

                if (cells[shoots].classList.contains('invader') === true) {
                    invaders.splice(invaders.indexOf(cells[shoots]))
                    console.log(invaders)
                    audio.src = 'assets/desintegration.mp3'
                    audio.play()
                    cells[shoots].classList.remove('invader')
                    cells[shoots].classList.remove('shoot')
                    clearInterval(shootsMovement)
                }
            }

        }, 200)
    }
}

window.addEventListener('DOMContentLoaded', setupGame)
