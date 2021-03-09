import { UserInputError } from "apollo-server-express";
import addDays from "date-fns/addDays";
import hyperid from "hyperid";
import {
  Author,
  Book,
  BookCategory,
  Resolvers,
  SearchResult,
} from "./generated/graphql";
import DateTime from "./scalars/DateTime";

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
    releaseDate: new Date(),
  },
  {
    id: id(),
    title: "Comic Book",
    author: authors[1],
    categories: [BookCategory.Comic],
    releaseDate: addDays(new Date(), 1),
  },
  {
    id: id(),
    title: "Cook And Essay Book",
    author: authors[2],
    categories: [BookCategory.Cook, BookCategory.Essay],
    releaseDate: addDays(new Date(), 2),
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
      if (!q) return items;

      return items.filter((item) => {
        if (implementsBook(item)) {
          return item.title.indexOf(q) > -1;
        }
        return item.name.indexOf(q) > -1;
      });
    },
    hello: () => {
      return "hello world";
    },
  },
  Mutation: {
    addBook: (_, { book }) => {
      const author = authors.find((a) => a.id === book.authorId);
      if (author == null) throw new UserInputError("not found author");

      const newBook: Book = {
        id: id(),
        title: book.title,
        author: author,
        categories: book.categories ?? [],
        releaseDate: book.releaseDate,
      };
      books.push(newBook);
      return newBook;
    },
  },
  DateTime: DateTime,
};

export default resolvers;

function implementsBook(arg: any): arg is Book {
  return (
    arg != null && typeof arg === "object" && typeof arg.title === "string"
  );
}
