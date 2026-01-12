async function aditUrl(){
    let url = document.getElementById("urlInput").value
    let response = await fetch("api/auditurl?url=" + url)
    let resultText = await response.text()

    document.getElementById("results").innerHTML = resultText
}