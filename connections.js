const fs = require('fs').promises;

// Define ANSI escape code sequences for different colors
const colour = {
    red: text => `\x1b[31m${text}\x1b[0m`,
    green: text => `\x1b[32m${text}\x1b[0m`,
    blue: text => `\x1b[34m${text}\x1b[0m`,
    yellow: text => `\x1b[33m${text}\x1b[0m`,
    magenta: text => `\x1b[35m${text}\x1b[0m`,
    cyan: text => `\x1b[36m${text}\x1b[0m`,
}


async function findConnections() {

    // import word list
    const imported = (await fs.readFile('words', 'utf8')).split(`\n`);
    const words = imported
        //filter out words containing anything besides lowercase alphabet
        .filter(word => /^[a-z]+$/.test(word))
        // filter out words with common endings, which can be boring
        .filter(word => !word.endsWith('s'))
        .filter(word => !word.endsWith('d'))
        .filter(word => !word.endsWith('r'))
        .filter(word => !word.endsWith('y'))
        // filter out long words
        .filter(word => word.length < 8)

    // check whether a letter can be removed from a word
    // NOTE: this is quite slow with a lot of words
    const removals = words
        .map(word => ({
            word, 
            validRemovals: word.split("").map((letter, index) => ({
                letter,
                // see if the word exists after removing the letter at the current index
                word: words[words.indexOf(
                    word.slice(0, index) + word.slice(index + 1) 
                )]
            }))
        }))
        .filter(({validRemovals}) => validRemovals.find(({word}) => word))

    // write valid removals to file
    await fs.writeFile('removals', JSON.stringify(removals, null, 2));

    // give summary of import/filter
    console.log(`imported ${
        colour.yellow(imported.length)
    }, filtered out ${
        colour.red(imported.length - words.length)
    }, clean ${
        colour.green(words.length)
    }, valid removals ${
        colour.green(removals.length)
    }`)


}

findConnections();