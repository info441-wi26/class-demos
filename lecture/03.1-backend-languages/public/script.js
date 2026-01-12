"use strict";

(function() {
  window.addEventListener("load", init);

  function init() {
    fetchPosts();

    let newpostButton = qs("#newpost #submit-button");
    if (newpostButton != null) {
      newpostButton.addEventListener("click", newPost);
    }

    let searchButton = qs("#search #submit-button");
    if (searchButton != null) {
      searchButton.addEventListener("click", search);
    }
  }

  function fetchPosts() {
    fetch("/posts")
      .then(checkStatus)
      .then(response => response.json())
      .then(populatePosts)
      .catch(handleError);
  }

  function populatePosts(data) {
    for (let i = 0; i < data.posts.length; i++) {
      let article = gen("article");
      let header = gen("h2");
      header.textContent = data.posts[i].title;
      article.appendChild(header);

      let author = gen("p");
      author.classList.add("by-line");
      author.textContent = "Author: " + data.posts[i].author;
      article.appendChild(author);

      let postBody = gen("p");
      postBody.textContent = data.posts[i].body;
      article.appendChild(postBody);

      let footer = gen("footer");
      let footerText = gen("p");
      footerText.textContent = "Posted at: " + data.posts[i].time;
      footer.appendChild(footerText);
      article.appendChild(footer);

      article.classList.add("post");
      id("articles").appendChild(article);
    }
  }

  function newPost(e) {
    e.preventDefault();
    let params = new FormData(id("post-form"));
    fetch("/newpost", { method : "POST", body : params })
      .then(checkStatus)
      .then(resp => resp.text())
      .then(displaySuccess)
      .catch(handleError);
  }

  function search(e) {
    e.preventDefault();
    let params = new FormData(id("post-form"));
    fetch("/search?author=" + params.get("author"))
      .then(checkStatus)
      .then(resp => resp.text())
      .then(appendSearchResults)
      .catch(handleError);
  }
  
  function displaySuccess() {
    id("post-form").classList.toggle("hidden");
    id("success-message").classList.toggle("hidden");
    id("success-message").textContent = "Posted Successfully";
  }

  function appendSearchResults(searchResults) {
    let results = gen('p');
    results.textContent = searchResults;
    id('results').appendChild(results);
  }

  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response; // a Response object
  }

  function handleError(err) {
    console.error(err);
  }

  function id(idName) {
    return document.getElementById(idName);
  }

  function gen(tagName) {
    return document.createElement(tagName);
  }

  function qs(query) {
    return document.querySelector(query);
  }
})();
