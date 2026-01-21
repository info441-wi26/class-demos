// Template Strings

// values that I want to put into html code
const title = "This page"
const subtitle = "this is an example page"
const description = "This is a description of my page"
//let description

// string addition to make html
const html1 = "<html><body>" +
              "<h1>" + title + "</h1>" +
              "<h2>" + subtitle + "</h2>" +
              "<p>" + description + "</p>" +
              "</body></html>"

console.log(html1)

// template strings with insertions
const html2 = `
<html>
<body>
    <h1>${title}</h1>
    <h2>${subtitle}</h2>
    <p>${description}</p>
</body>
</html>`
console.log(html2)

// what if description is undefined?

// solution 1: ternary operator
//     condition ? true return value : false return value
const html3 = `
<html>
<body>
    <h1>${title}</h1>
    <h2>${subtitle}</h2>
    <p>${description ? description : ""}</p>
</body>
</html>`
console.log(html3)

// solution 2: function
function descriptionHtml(description){
    if(description){
        return `<p>${description}</p>`
    }else {
        return ""
    }
}
const html4 = `
<html>
<body>
    <h1>${title}</h1>
    <h2>${subtitle}</h2>
    ${descriptionHtml(description)}
</body>
</html>`
console.log(html4)


/////////////////////////////
// Iterators Demo

// weirdly formatted data (so I can demo fixing it)
let dataArr = [
    "first name : Kyle",
    "last name : Thayer",
    "age : 43",
    "glasses : yes"
]

// "forEach" runs a function on each item in an object/array
// we will use it to extract the values into an object
let valuesDictionary = {}
dataArr.forEach(item => {
    const split_item = item.split(" : ")
    const item_key = split_item[0]
    const item_value = split_item[1]
    valuesDictionary[item_key] = item_value
})
console.log(valuesDictionary)

// "map" creates a modified version of an array
// the new array will have values that are the result of
// running the function on items form original array

// map demo 1: replace the ":" with "="
let modifiedDataArr = dataArr.map(item => {
    return item.replace(":", "=")
})
console.log(modifiedDataArr)

// map demo 2: just get the key (first part) of each string
let modifiedDataArr2 = dataArr.map(item => {
    return item.split(" : ")[0]
})
console.log(modifiedDataArr2)

// "filter" goes through an array and makes a new array with
// only the items that passed a given function (function returned tru)

// filter demo: keep only strings with "name"
let filteredDataArr = dataArr.filter(item => {
    if(item.includes("name")){
        return true
    }else {
        return false
    }
})
console.log(filteredDataArr)

// we can "chain" some of these iterators together

// chain demo: get only name info, but also replace ":" with "="
let filteredDataArr2 = 
    dataArr
        .filter(item => item.includes("name"))
        .map(item => item.replace(":", "="))

console.log(filteredDataArr2)