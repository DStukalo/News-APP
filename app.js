function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("get", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }

          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });
        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });
        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("post", url);
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }

          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });
        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });
        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}

const myHTTP = customHttp();

const newsService = (function () {
  const apiKey = "d499a1646e134805a145fb29870f0e41";
  const apiUrl = "https://news-api-v2.herokuapp.com";
  // const apiUrl = "http://newsapi.org/v2";
  return {
    topHeadlines(country = "us", category = "general", cb) {
      myHTTP.get(
        `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`,
        cb
      );
    },
    everything(query, cb) {
      myHTTP.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
  };
})();

const form = document.forms["newsControls"];
const countrySelect = form.elements["country"];
const categorySelect = form.elements["category"];
const searchInput = form.elements["search"];
const formObj = {
  country: countrySelect.value,
  category: categorySelect.value,
  searchText: searchInput.value,
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  loadNews(formObj);
});

document.addEventListener("DOMContentLoaded", function () {
  loadNews(formObj);
});

function loadNews(formObj) {
  const newsContainer = document.querySelector(".news-container");
  newsContainer.insertAdjacentHTML("afterbegin", showPreloader());
  if (!formObj.searchText) {
    newsService.topHeadlines(formObj.country, formObj.category, onGetResponse);
  } else {
    newsService.everything(formObj.searchText, onGetResponse);
  }
}

function onGetResponse(err, res) {
  if (err) {
    ShowAlert(err, "error-msg");
    return;
  }
  if (!res.articles.length) {
    showEmptyMessage();
    return;
  }
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
