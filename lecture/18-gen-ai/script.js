window.addEventListener('load', init)
function init() {
    document.getElementById('file-input').addEventListener(
        'change',
        handleUpload
    )

    document.querySelector('button').addEventListener(
        'click',
        generateText
    )
}

let source_text = '';

async function handleUpload(e) {
    e.preventDefault();
    file = e.target.files[0]
    source_text = await file.text()
}

function generateText() {
    let in_text = document.getElementById('word-input').value;
    let word_count = document.getElementById('count-input').value;

    console.log("Calculating subsequent-word frequencies...");
    pairings = generateWordPairs(source_text);

    console.log(`Generating new text, ${word_count} words long, starting from ${in_text}`);
    let current_word = in_text;
    let new_text = in_text;
    for (let i = 0; i < word_count; i++) {
        let next_word = chooseWeightedWord(pairings[current_word]);
        new_text += " " + next_word;
        currnt_word = next_word;
    }

    let out_p = document.getElementById('output');
    out_p.textContent = new_text;
}

/**
 * Generates a mapping of words to words that come after it and how often. 
 **/
function generateWordPairs(text) {
    let result = {};
    text = text.toLowerCase();
    text = text.replace(/[^\w\s]/g, '');
    text = text.replace(/\n/g, ' ');
    text = text.replace(/ {2,}/g, ' ');
    let words = text.split(' ');

    for (let i = 0; i < words.length - 1; i++) {
        let currentWord = words[i];
        let nextWord = words[i + 1];

        if (result[currentWord] === undefined) {
            result[currentWord] = {};
        }

        if (result[currentWord][nextWord] === undefined) {
            result[currentWord][nextWord] = 1;
        } else {
            result[currentWord][nextWord] += 1;
        }
    }

    return result;
}

/**
 * From a set of subsequent-word frequencies (as from `generateWordPairs`),
 * return a random next word, weighted by often it appears.
 **/
function chooseWeightedWord(frequencies) {
    let total = 0;
    for (let word in frequencies) {
        total += frequencies[word];
    }

    let threshold = Math.random() * total;

    let cumulative = 0;
    for (let word in frequencies) {
        cumulative += frequencies[word];
        if (threshold < cumulative) {
            return word;
        }
    }
}
