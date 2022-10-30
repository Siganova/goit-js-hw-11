import axios from "axios"

const API_KEY = "30907085-7e61b5694251a4f90ae544bfd"


export default async function fetchImage(query="random",page=1, perPage = 40){
    return await axios(`https://pixabay.com/api/?key=${API_KEY}&q=${query}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`);
}