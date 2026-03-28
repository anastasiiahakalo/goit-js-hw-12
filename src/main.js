import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
let totalHits = 0;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  query = e.target.elements.search.value.trim();

  if (!query) return;

  page = 1;
  clearGallery();
  hideLoadMoreButton();

  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message: "Sorry, no images found.",
      });
      return;
    }

    createGallery(data.hits);
    showLoadMoreButton();

    // проверка конца
    if (page * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({ message: "Error fetching images" });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener("click", async () => {
  page += 1;

  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    createGallery(data.hits);

    
    const card = document.querySelector(".gallery-item");
    const rect = card.getBoundingClientRect();

    window.scrollBy({
      top: rect.height * 2,
      behavior: "smooth",
    });

    if (page * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({ message: "Error loading more images" });
  } finally {
    hideLoader();
  }
});

hideLoadMoreButton();