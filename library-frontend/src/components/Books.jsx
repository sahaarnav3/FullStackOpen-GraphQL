import { useState } from "react";
import { ALL_BOOKS, ME } from "../queries";
import { useQuery } from "@apollo/client/react";

const Books = () => {
  const result = useQuery(ALL_BOOKS);
  const [genre, setGenre] = useState("");
  if (result.loading) return <h2>Loading...</h2>;

  const books =
    genre === ""
      ? result.data.allBooks
      : result.data.allBooks.filter((b) => b.genres.includes(genre));

  const genres = new Set();
  result.data.allBooks.forEach((book) => {
    book.genres.forEach((genre) => genres.add(genre));
  });

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {[...genres].map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenre("")}>all genres</button>
    </div>
  );
};

export default Books;
