import React, { useEffect, useState } from "react";
import "../Styles/Home.css";
import axios from "axios";
import Cookies from "universal-cookie";
import styled from "styled-components";
import MovieComponent from "./MovieComponent";
import MovieInfoComponent from "./MovieInfoComponent";
const cookies = new Cookies();
const token = cookies.get("TOKEN");
export const API_KEY = "9e049c31";

const Home = () => {
  const MovieListContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 100px 50px;
    flex-wrap: wrap;
    padding: 10px;
    gap: 25px;
    justify-content: space-evenly; ;
  `;
  const Placeholder = styled.img`
    width: 120px;
    height: 120px;
    margin: 50px;
    opacity: 70%;
  `;
  
  const [user, setUser] = useState({});
  const [loading,setLoading] = useState(true);
  const [minLoading, setMinLoading] = useState(false);
  const [searchQuery, updateSearchQuery] = useState("");
  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState();
  const [timeoutId, updateTimeoutId] = useState();

  useEffect(() => {
    const configuration = {
      method: "get",
      url: "/get-user-data",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(configuration)
      .then((result) => {
        setUser(result.data);
        setLoading(false);
      })
      .catch((error) => {
        error = new Error();
      });
        //eslint-disable-next-line
  }, []);

    const fetchData = async (searchString) => {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchString}&apikey=${API_KEY}`

      );
      updateMovieList(response.data.Search);
      setMinLoading(false);
    };

    const onTextChange = (e) => {
      setMinLoading(true)
      onMovieSelect("");
      clearTimeout(timeoutId);
      updateSearchQuery(e.target.value);
      const timeout = setTimeout(() => fetchData(e.target.value), 500);
      updateTimeoutId(timeout);
    };

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    window.location.href = "/login";
  };

  if(loading){
    return(
      <>
      <div className="home-container">
        <div className="loader"></div>
      </div>
      </>
    );
  }else{
    return (
      <div className="home-container">
        <div className="header">
          <div className="header-left">
            <h2 className="margin-none">
              <i>Movist</i>
            </h2>
          </div>
          <div className="header-right">
            <button type="submit" onClick={() => logout()} className="form-btn">
              Logout
            </button>
          </div>
        </div>
        <div className="user-card">
          <div className="user-name">
            <img src="/static/playlist.png" alt="" className="icon" />
            Your Playlists Will Appear Here</div>
        </div>
        <div className="user-card">
          <div className="user-name">{`Welcome, ${user.username}`}</div>
          <form action="#" method="POST">
            <input
              type="text"
              id="search"
              name="search"
              value={searchQuery}
              onChange={onTextChange}
              className="form-input-search"
              placeholder="Start typing to search for your favourite titles"
              autoComplete="on"
            />
            {minLoading ? <div className="loader"></div> : ""}
          </form>
        </div>
        {selectedMovie && (
          <MovieInfoComponent
            selectedMovie={selectedMovie}
            onMovieSelect={onMovieSelect}
          />
        )}
        <MovieListContainer>
          {movieList?.length ? (
            movieList.map((movie, index) => (
              <MovieComponent
                key={index}
                movie={movie}
                onMovieSelect={onMovieSelect}
              />
            ))
          ) : (
            <Placeholder src="/static/reel.png" />
          )}
        </MovieListContainer>
      </div>
    );
  }
};
export default Home;
