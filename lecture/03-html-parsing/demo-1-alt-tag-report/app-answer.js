import fetch from 'node-fetch'
import parser from 'node-html-parser'

const url = "https://ischool.uw.edu"
const response = await fetch(url)
const pageText = await response.text()

console.log(pageText)

const htmlPage = parser.parse(pageText)
const imgTags = htmlPage.querySelectorAll("img")
for(let i = 0; i < imgTags.length; i++){
    const imgTag = imgTags[i]

    console.log(`Image ${i} info:`)
    console.log(`alt text: ${imgTag.attributes.alt}`)
    console.log(`img src: ${imgTag.attributes.src}`)
    console.log(`\n\n`)
}