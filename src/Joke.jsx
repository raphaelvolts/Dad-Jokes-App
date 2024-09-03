import "./Joke.css";

export default function Joke({ text, vote, upvote, downvote }) {
  function getColor() {
    if (vote >= 15) {
      return "#4caf50";
    } else if (vote >= 12) {
      return "#8bc34a";
    } else if (vote >= 9) {
      return "#CDDC39";
    } else if (vote >= 6) {
      return "#ffeb3b";
    } else if (vote >= 3) {
      return "#ffc107";
    } else if (vote >= 0) {
      return "#ff9800";
    } else if (vote < 0) {
      return "#f44336";
    }
  }
  function getEmoji() {
    if (vote >= 15) {
      return "em em-rolling_on_the_floor_laughing";
    } else if (vote >= 12) {
      return "em em-laughing";
    } else if (vote >= 9) {
      return "em em-smiley";
    } else if (vote >= 6) {
      return "em em-slightly_smiling_face";
    } else if (vote >= 3) {
      return "em em-neutral_face";
    } else if (vote >= 0) {
      return "em em-confused";
    } else if (vote < 0) {
      return "em em-angry";
    }
  }
  return (
    <div className="Joke">
      <div className="Joke-buttons">
        <i className="fa-solid fa-arrow-up" onClick={upvote}></i>
        <span className="Joke-vote" style={{ borderColor: getColor() }}>
          {vote}
        </span>
        <i className="fa-solid fa-arrow-down" onClick={downvote}></i>
      </div>
      <div className="Joke-text">{text}</div>
      <div className="Joke-smiley">
        <i className={getEmoji()}></i>
      </div>
    </div>
  );
}
