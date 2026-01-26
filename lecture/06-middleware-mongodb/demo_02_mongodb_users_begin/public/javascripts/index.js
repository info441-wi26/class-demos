async function createUser(){
    // get data from the html
    let first_name = document
        .getElementById("first_name_input").value
    let last_name = document
        .getElementById("last_name_input").value
    let favorite_ice_cream = document
        .getElementById("favorite_ice_cream_input").value

    let myData = {
        "first_name": first_name,
        "last_name": last_name,
        "favorite_ice_cream": favorite_ice_cream
    }

    console.log(myData)

    // send post request to server
    let reponse = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(myData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

async function getUsers(){
  let response = await fetch("api/users")
  let userData = await response.json()
  console.log(userData)

  document.getElementById("results").innerHTML = JSON.stringify(userData)
}
