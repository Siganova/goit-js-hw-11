import fetchImage from "./js/fetchImages";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import galleryItem from "./templates/gallery-item.hbs";
import Notiflix from "notiflix";

const searchFormRef = document.querySelector(`#search-form`);
const galleryRef = document.querySelector(`.gallery`);
const loadMoreBtn = document.querySelector('.btn-load-more');

let simpleLightBox = null;
let page = 1;
let perPage = 40;
let q = '';
let totalPage = 0;

searchFormRef.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(e) {
    e.preventDefault();

    q = e.currentTarget.elements.searchQuery.value.trim();
    loadMoreBtn.classList.add('is-hidden');
    if (!q) {
        Notiflix.Notify.failure("Please, fill in the field");
        return;
    }
    resetPage();
    galleryRef.innerHTML = "";
    totalPage = 0;
    getData();
}

function onLoadMore() {
    loadMoreBtn.classList.add('is-hidden');
    getData();
}

function getData() {
    fetchImage(q, page, perPage).then(resp => {
        if (resp.data && (!resp.data.totalHits || !resp.data.hits.length)){
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }

        totalPage = Math.ceil(resp.data.totalHits / perPage);

        if(page === 1){
            Notiflix.Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
        }
        const markup = resp.data.hits.map(image => {
            return galleryItem(image);
        }).join('');
        galleryRef.insertAdjacentHTML('beforeend', markup);
        loadMoreBtn.classList.remove('is-hidden', page >= totalPage);

        if(!simpleLightBox){
            simpleLightBox = new SimpleLightbox('.gallery a');
        } else {
            simpleLightBox.refresh();
        }

        if ( page >= totalPage) {
            loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.warning('We are sorry, but you have reached the end of search results.');
            return;
        }

        incrementPage();
    });
}

function incrementPage(){
    page += 1;
}

function resetPage(){
    page = 1;
}