import { useState } from "react";
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries";
import { useMutation } from "@apollo/client/react";

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    // update: (cache, response) => {
    //   cache.updateQuery({ ALL_AUTHORS }, ({ allAuthors }) => {
    //     return {
    //       allAuthors: allAuthors.concat(response.data.addAuthor),
    //     };
    //   });
    //   cache.updateQuery({ ALL_BOOKS }, ({ allBooks }) => {
    //     return {
    //       allBooks: allBooks.concat(response.data.allBooks),
    //     };
    //   });
    // },
  });

  const submit = async (event) => {
    event.preventDefault();
    await addBook({ variables: { title, author, published, genres } });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            aria-label="title"
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            aria-label="author"
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
            aria-label="published"
          />
        </div>
        <div>
          <input
            type="text"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
            aria-label="genre"
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
