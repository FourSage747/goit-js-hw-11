import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const baseurl = 'https://pixabay.com/api/';
const apikey =
  '38858047-0e9bab85a13771b942d481ede';
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadmore = document.querySelector('.load-more');
loadmore.style.display = 'none';

let page = 1;


loadmore.addEventListener('click', onLoad);
async function onLoad() {
  page += 1;
  const searchQuery = form.elements.searchQuery.value;
  
  try {
      const data = await search(searchQuery, page);
      gallery.insertAdjacentHTML('beforeend', createCards(data.hits));
      lightbox.refresh();
      
      if (page * 40 >= data.totalHits) {
          loadmore.style.display = 'none';
          Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      }
  } catch (err) {
      console.log(err);
  }
}


async function search(id, page) {
  try {
    const resp = await fetch(`${baseurl}?key=${apikey}&q=${id}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
    
    if (!resp.ok) {
     throw new Error(resp.statusText);
    }
      
  
    return resp.json();
  }
  catch (err) {
    console.log(err);
  }
  
}


  form.addEventListener('submit', submittop);
  async function submittop(evt) {
      evt.preventDefault();
      loadmore.style.display = 'none';
      page = 1
      const searchQuery = form.elements.searchQuery.value;
      try {
        const data = await search(searchQuery, page)
        if (data.hits.length === 0) {
          Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
          return;
        }
        gallery.innerHTML = createCards(data.hits)
        loadmore.style.display = 'block';
        lightbox.refresh();
        console.log(data)
      }
      catch(err ) {
        console.log(err);
      }
  }

  function createCards (arr) {
    return arr
        .map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `
        <div class="photo-card">
            <a href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" width="330" height="230" />
            </a>
                <div class="info">
                    <p class="info-item">
                        <b>Likes ${likes}</b>
                    </p>
                    <p class="info-item">
                        <b>Views ${views}</b>
                    </p>
                    <p class="info-item">
                        <b>Comments ${comments}</b>
                    </p>
                    <p class="info-item">
                        <b>Downloads ${downloads}</b>
                    </p>
                </div>
        </div>
        `).join('');
  }
  const lightbox = new SimpleLightbox('.gallery a', {
    caption: true,
    captionsData: 'alt',
    captionDelay: 250,
  });