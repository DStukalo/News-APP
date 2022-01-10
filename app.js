const newsService = (function () {
  const apiKey = "d499a1646e134805a145fb29870f0e41";
  const apiUrl = "http://newsapi.org/v2";
  // const apiUrl = "https://news-api-v2.herokuapp.com";
  return {
    topHeadlines(country = "ua", category = "general", cb) {
      fetch(
        `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`
      )
        .then((response) => response.json())
        .then((post) => onGetResponse(post))
        .catch((rej) => console.log(rej));
    },
    everything(query, cb) {
      fetch(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`)
        .then((response) => response.json())
        .then((post) => onGetResponse(post))
        .catch((rej) => console.log(rej));
    },
  };
})();

const form = document.forms["newsControls"];
const countrySelect = form.elements["country"];
const categorySelect = form.elements["category"];
const searchInput = form.elements["search"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  loadNews();
});

document.addEventListener("DOMContentLoaded", function () {
  loadNews();
});

function loadNews() {
  const country = countrySelect.value;
  const category = categorySelect.value;
  const searchText = searchInput.value;
  const newsContainer = document.querySelector(".news-container");
  newsContainer.insertAdjacentHTML("afterbegin", showPreloader());
  if (!searchText) {
    newsService.topHeadlines(country, category, onGetResponse);
  } else {
    newsService.everything(searchText, onGetResponse);
  }
}

function onGetResponse(res) {
  console.log("first and two");
  console.log(res);
  renderNews(res.articles);
}

function renderNews(news) {
  const newsContainer = document.querySelector(".news-container");

  let fragment = "";
  if (newsContainer.children) {
    clearContainer(newsContainer);
  }
  news.forEach((newsItem) => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });
  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

function newsTemplate(newsItem) {
  return `
  <div class="container-card">
    <div class="news-card">
      <div class="news-image">
        <img src=${
          newsItem.urlToImage ||
          "https://cdn.pixabay.com/photo/2020/12/01/10/04/dog-5793625_960_720.jpg"
        }>
          <p class="card-title">${newsItem.title || ""}</p>
      </div>
      <div class="card-content">${newsItem.description || ""}</div>
      <div class="card-action">
        <a href=${newsItem.url}>Read more...</a>
      </div>
    </div>
  </div>
  `;
}

function ShowAlert(err, message) {
  alert(err, message);
}

function clearContainer(container) {
  container.innerHTML = "";
}

function showEmptyMessage() {
  alert("Новини не передано");
}

function showPreloader() {
  return `
  <div class="preloader">
    <div class="preloader__row">
       <div class="preloader__item"></div>
       <div class="preloader__item"></div>
    </div>
  </div>
  `;
}
