import { UserInputError } from "apollo-server-express";
import hyperid from "hyperid";
import {
  Author,
  Book,
  BookCategory,
  Resolvers,
  SearchResult,
} from "./generated/graphql";

const id = hyperid();

const authors: Author[] = [
  {
    id: id(),
    name: "John Doe",
  },
  {
    id: id(),
    name: "Jane Doe",
  },
  {
    id: id(),
    name: "Alan Smithee",
  },
];

const books: Book[] = [
  {
    id: id(),
    title: "Novels Book",
    author: authors[0],
    categories: [BookCategory.Novels],
  },
  {
    id: id(),
    title: "Comic Book",
    author: authors[1],
    categories: [BookCategory.Comic],
  },
  {
    id: id(),
    title: "Cook And Essay Book",
    author: authors[2],
    categories: [BookCategory.Cook, BookCategory.Essay],
  },
];

const resolvers: Resolvers = {
  SearchResult: {
    __resolveType(parent) {
      return implementsBook(parent) ? "Book" : "Author";
    },
  },
  Query: {
    books: () => books,
    authors: () => authors,
    search: (_, { q }) => {
      let items: SearchResult[] = [];
      items = items.concat(authors).concat(books);
      return items;
    },
  },
  Mutation: {
    addBook: (_, { book }) => {
      const author = authors.find((a) => a.id === book.authorId);
      if (author == null) throw new UserInputError("not found author");

      const newBook = {
        id: id(),
        title: book.title,
        author: author,
        categories: book.categories ?? [],
      };
      books.push(newBook);
      return newBook;
    },
  },
};

export default resolvers;

function implementsBook(arg: any): arg is Book {
  return (
    arg != null && typeof arg === "object" && typeof arg.title === "string"
  );
}
