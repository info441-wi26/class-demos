
async function addUser(){
    let name = document.getElementById("name_input").value

    await fetch("/api/v1/users", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: name})
    })
}

async function loadUsers(){
    document.getElementById("allusersdiv").innerText = "loading..."

    let response = await fetch("/api/v1/users")
    let usersJson = await response.json()

    let usersHTML = usersJson.map(userInfo => {
        return `
        <hr>
        <div>
            <h3>
                Username: ${userInfo.username}
                <button onclick="deleteUser('${userInfo._id}')">Delete</button>
            </h3>
            <strong>Favorite Bands:</strong> ${userInfo.favorite_bands.join(", ")} <br>
            <strong>Add Band:</strong> <input type="text" id="add_band_text_${userInfo._id}" />
            <button onclick="addBand('${userInfo._id}')">Add Band</button>

            <h3>Playlists</h3>
            <div id="playlist_div_${userInfo._id}">Loading playlists...</div>

            <h3>Add Playlist</h3>
            <strong>Title:</strong> <input type="text" id="add_playlist_title_text_${userInfo._id}" /> <br>
            <strong>Songs:</strong> <input type="text" id="add_playlist_song_text_${userInfo._id}" /> <br>
            <button onclick="addPlaylist('${userInfo._id}')">Add Playlist</button>
        </div>
        `
    }).join("<hr>")

    document.getElementById("allusersdiv").innerHTML = usersHTML 

    usersJson.forEach(userInfo => {
        loadPlaylistsForUser(userInfo._id)
    })
}

async function loadPlaylistsForUser(userId){
    // get playlists for that user
    let response = await fetch("/api/v1/playlists?userId=" + userId)
    let playlistJSON = await response.json()

    // add html to the right div for that user
    let playlistHTML = playlistJSON.map(playalistInfo => {
        return `
        <div>
            <h4>Playlist: ${playalistInfo.title}</h4>
            <strong>Songs:</strong> ${playalistInfo.songs}
        </div>
        `
    }).join("")

    document.getElementById("playlist_div_" + userId).innerHTML = playlistHTML

}

async function addPlaylist(id){
    let title = document.getElementById("add_playlist_title_text_" + id).value
    let songs = document.getElementById("add_playlist_song_text_" + id).value

    await fetch("/api/v1/playlists", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: title,
            songs: songs,
            userId: id
        })
    })

}

async function addBand(id){
    let bandToAdd = document.getElementById("add_band_text_" + id).value

    await fetch("/api/v1/users/bands", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            userId: id,
            band: bandToAdd
        })
    })
}

async function deleteUser(id){
    await fetch("/api/v1/users", {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            userId: id
        })
    })
}
