async function checkTime(){
    let response = await fetch("api/getTime")
    let resultText = await response.text()

    document.getElementById("results").innerHTML = resultText
}