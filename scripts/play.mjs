import colour from '../tools/colour.mjs'
import waitForKeypress from '../tools/waitForKeypress.mjs'

async function play(removals) {
    // pick a random word to start the game
    const index = Math.floor(Math.random() * removals.length)
    const startWord = removals[index]

    // take that word out, so it doesn't get reused
    const newRemovals = removals.toSpliced(index, 1)

    // pick a random letter to start the game
    const validRemovals = startWord.validRemovals.filter(({ word }) => word)
    const startRemoval = validRemovals[Math.floor(Math.random() * validRemovals.length)]

    // find other words that could have this letter added
    const connections = newRemovals.filter(({ validRemovals }) => 
        validRemovals.find(({ letter, word }) => 
            letter===startRemoval.letter
            && word
        )
    )

    // pick a random connection to start with
    const startConnection = connections[
        Math.floor(Math.random() * connections.length)
    ]

    // find the matching removal
    const startConnectionRemoval = startConnection.validRemovals.find(({ word, letter }) => 
        letter===startRemoval.letter && word
    )

    // output the puzzle
    process.stdout.write(`${
        colour.cyan(startWord.word)
    } -> ${
        colour.yellow(startConnectionRemoval.word)
    } `)

    // wait for input
    const { sequence } = await waitForKeypress();

    // output the solution
    console.log(` - ${
        sequence===startRemoval.letter 
        ? colour.green(`${sequence} ✓`)
        : colour.red(`${sequence} ✗`)
    } ${colour.grey('(solution: move')} ${
        colour.green(startRemoval.letter)
    }${colour.grey(', making')} ${
        colour.cyan(startRemoval.word)
    }${colour.grey(' and')} ${
        colour.yellow(startConnection.word)
    })`)

    play(newRemovals)

    // ##### TODO: 
    // - remove rude words
    // - check for correct words on main word list
}


export default play