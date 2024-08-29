import { useState, useEffect } from "react";
import axios from "axios";

export default function JokesList() {
  const numJokesToGet = 10;

  async function getJoke() {
    const jokez = [];
    while (jokez.length < numJokesToGet) {
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" }
      });
      jokez.push(res.data.joke);
    }
    return jokez;
  }
  const jokeArray = [];
  const [jokes, setJokes] = useState(jokeArray);
  useEffect(() => {
    getJoke().then((jokez) => {
      setJokes([...jokez]);
    });
  }, []);
  return (
    <div className="JokeList">
      <h1>Dad Jokez</h1>
      <div className="JokeList-jokes">
        {jokes.map((j, i) => (
          <div key={`J-${i}`}>{j}</div>
        ))}
      </div>
    </div>
  );
}
