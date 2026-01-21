async function getPterosaurs(){
    let response = await fetch("api/getPterosaurs")
    try{
        let PterosaurJson = await response.json()

        let PterosaurHtml = PterosaurJson.map(onePterosaur => {
            return `
            <div>
            <p>${onePterosaur.Genus}</p>
            <img src="${onePterosaur.img}" />
            </div>
            `
        }).join("")
        document.getElementById('results').innerHTML = PterosaurHtml

    } catch(err){
    document.getElementById('results').innerHTML = `
        Status: ${response.status}: ${response.statusText} <br>
        Error: ${err}`
    }

}
