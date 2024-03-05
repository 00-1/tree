import { promises as fs } from 'fs';
import colour from '../tools/colour.mjs'


async function findConnections() {

    // import word list
    const imported = (await fs.readFile('data/words', 'utf8')).split(`\n`);
    const words = imported
        //filter out words containing anything besides lowercase alphabet
        .filter(word => /^[a-z]+$/.test(word))
        // filter out words with common start/ends, which can be boring
        .filter(word => !word.endsWith('s'))
        .filter(word => !word.endsWith('ed'))
        .filter(word => !word.endsWith('er'))
        .filter(word => !word.endsWith('ing'))
        .filter(word => !word.endsWith('y'))
        .filter(word => !word.startsWith('a'))
        // filter out long words
        .filter(word => word.length < 10)

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
        // filter words with at least 3 valid removals
        .filter(({validRemovals}) => validRemovals.filter(({word}) => word).length > 2)

    // write valid removals to file
    await fs.writeFile('data/removals-temp', `export default ${
        JSON.stringify(removals, null, 2)
    }`);

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