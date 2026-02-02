import * as cheerio from 'cheerio';
import express from 'express';
const app = express();


const escapeHTML = str => String(str).replace(/[&<>'"]/g, 
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag]));


// This string mocks what a user might *try* to input on the client side of your site... 
// you should not allow this/clean it up
const userInputWithHTML = "<span id=userInput>Don't allow <em>tags</em> to be <strong>rendered</strong></span>"

// This function mocks the unsafe way of doing this: it doesn't clean the string
// or check if anything vulnerable is in here. When you see it rendered, you'll notice 
// that user inputted <em> and <strong> remain
function vulnerableAddUserInput(){
  return `
  <p>
  <strong>Here is the user input:</strong> ${userInputWithHTML}
  </p>
  `
}

function fixWithFunction(){
    return `
  <p>
  <strong>Here is the user input:</strong> ${escapeHTML(userInputWithHTML)}
  </p>
  `
}

function fixWithInnerText(){
  let htmlString = `
  <p>
  <strong>Here is the user input:</strong><span id="userInput1"></span>
  </p>
  `
  let parsedHtml = cheerio.load(htmlString)
  parsedHtml('#userInput1').text(userInputWithHTML)

  return parsedHtml.html()
}

// Below are the sections we'll be working though to learn how to avoid XSS
app.get('/', (req, res) => {
  res.send(`
  <html><body>
  <h1> demo for xss escaping</h1>

  <h2> vulnerable user input </h2>
  ${vulnerableAddUserInput()}

  <h2> fix with function </h2>
  ${fixWithFunction()}

 <h2> fix with inner text </h2>
  ${fixWithInnerText()}

  
  </body>
  </html>
  `)
})

app.listen(3000, ()=>{
  console.log('Example app listening at http://localhost:3000')
})

