import readline from 'readline'

export default () => new Promise(resolve => {
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

  