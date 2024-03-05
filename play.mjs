import removals from './removals.mjs'
import colour from './colour.mjs'
import readline from 'readline'

function waitForKeypress() {
    return new Promise(resolve => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
  
      // Listen for keypress event
      process.stdin.once('keypress', (str, key) => {
        if (key && key.ctrl && key.name === 'c') {
            // If Ctrl + C is pressed, exit the program
            console.log('\ngame over')
            process.exit();
          } else {
            // move cursor back to the beginning of the input:
            readline.moveCursor(rl.output, -rl.line.length, 0);
            // clear everything to the right of the cursor:
            readline.clearLine(rl.output, 1);

            rl.close();
            resolve(key);
          }
      });
  
      // Enable listening for keypress events
      rl.input.setRawMode(true);
      rl.input.resume();
    });
  }
  


async function play() {
    // pick a random word to start the game
    const startWord = removals[Math.floor(Math.random() * removals.length)]

    // pick a random letter to start the game
    const validRemovals = startWord.validRemovals.filter(({ word }) => word)
    const startRemoval = validRemovals[Math.floor(Math.random() * validRemovals.length)]

    // find other words that could have this letter added
    const connections = removals.filter(({ validRemovals }) => 
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

    play()
}


play();