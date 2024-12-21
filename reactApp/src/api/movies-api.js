export const getMovies = async () => {
    const response = await  fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=e7bc7127c17a475d9f53fc0ee3faa1ed&language=en-US&include_adult=false&page=1`
    )
    return response.json()
  };