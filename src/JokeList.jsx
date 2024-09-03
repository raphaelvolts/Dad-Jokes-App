import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import Joke from "./Joke";
import "./JokeList.css";

export default function JokesList() {
  const numJokesToGet = 10;

  async function getJoke(loadedJokes) {
    const jokez = [];
    const loadedJokez = new Set();
    if (jokes.jokes.length > 0) {
      const savedJokez = Array.from(loadedJokes.values()).values();
      for (const value of savedJokez) {
        loadedJokez.add(value);
      }
    }
    try {
      while (jokez.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" }
        });
        if (loadedJokez.size > 0) {
          if (!loadedJokez.has(res.data.id)) {
            jokez.push(makeJoke(res.data.id, res.data.joke));
            loadedJokez.add(res.data.id);
          }
        } else {
          jokez.push(makeJoke(res.data.id, res.data.joke));
          loadedJokez.add(res.data.id);
        }
      }
      return [jokez, loadedJokez];
    } catch (e) {
      alert(e);
      setJokes((oj) => {
        return { ...oj, loading: false };
      });
    }
  }
  function makeJoke(jokeID, joke) {
    return { id: uuid(), jokeID: jokeID, joke: joke, vote: 0 };
  }
  const [jokes, setJokes] = useState(
    JSON.parse(localStorage.getItem("jokes"), (key, value) => {
      return key === "loadedJokes" ? new Set(value) : value;
    }) || {
      jokes: [],
      loading: false,
      loadedJokes: new Set()
    }
  );
  useEffect(() => {
    if (jokes.jokes.length === 0) {
      const { loadedJokes } = jokes;
      getJoke(loadedJokes).then(([jokes, loadedJokes]) => {
        localStorage.setItem(
          "jokes",
          JSON.stringify(
            {
              jokes: jokes,
              loading: false,
              loadedJokes: loadedJokes
            },
            (key, value) => {
              return value instanceof Set ? Array.from(value.values()) : value;
            }
          )
        );
        setJokes({
          jokes: [...jokes],
          loading: false,
          loadedJokes: loadedJokes
        });
      });
    } else {
      localStorage.setItem(
        "jokes",
        JSON.stringify(jokes, (key, value) => {
          return value instanceof Set ? Array.from(value.values()) : value;
        })
      );
    }
  }, [jokes]);
  function handleClick() {
    setJokes((oj) => {
      return { ...oj, loading: true };
    });
    const { loadedJokes } = jokes;
    getJoke(loadedJokes).then(([jokes, loadedJokes]) => {
      console.log(jokes.loadedJokes);
      setJokes((oldJokes) => {
        return {
          jokes: [...oldJokes.jokes, ...jokes].sort((a, b) => b.vote - a.vote),
          loading: false,
          loadedJokes: oldJokes.loadedJokes.union(loadedJokes)
        };
      });
    });
  }
  function handleVote(id, delta) {
    setJokes((oj) => {
      const jokes = oj.jokes.map((j) =>
        j.id === id ? { ...j, vote: j.vote + delta } : j
      );
      return { ...oj, jokes: [...jokes] };
    });
  }
  if (!jokes.loading) {
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokez
          </h1>
          <img
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
            alt="Laughing Icon"
          />
          <button className="JokeList-getmore" onClick={handleClick}>
            New Jokes
          </button>
        </div>
        <div className="JokeList-jokes">
          {jokes.jokes.map((j, i) => (
            <Joke
              key={j.jokeID}
              text={j.joke}
              vote={j.vote}
              upvote={() => handleVote(j.id, 1)}
              downvote={() => handleVote(j.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  } else return <Loading />;
}

function Loading() {
  return (
    <div className="JokeList-spinner">
      <i className="far fa-8x fa-laugh fa-spin" />
      <h1 className="JokeList-title">Loading...</h1>
    </div>
  );
}
