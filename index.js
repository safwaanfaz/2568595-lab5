const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let books = [];

const findBookById = (id) => books.find((book) => book.id === id);
const findDetailById = (book, detailId) =>
  book.details.find((detail) => detail.id === detailId);

const handleNotFound = (res, message) => res.status(404).json({ error: message });
const handleBadRequest = (res, message) => res.status(400).json({ error: message });

app.get('/whoami', (req, res) =>
  res.json({
    studentNumber: '2568595',
  })
);

app.get('/books', (req, res) => res.json(books));

app.get('/books/:id', (req, res) => {
  const book = findBookById(req.params.id);
  book ? res.json(book) : handleNotFound(res, 'Book not found');
});

app.post('/books', (req, res) => {
  const { id, title, details } = req.body;

  if (!id || !title || !Array.isArray(details) || details.length === 0) {
    return handleBadRequest(res, 'Missing required book details');
  }

  if (findBookById(id)) {
    return handleBadRequest(res, 'Book with this ID already exists');
  }

  const newBook = { id, title, details };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
  const book = findBookById(req.params.id);
  if (!book) return handleNotFound(res, 'Book not found');

  const { title, details } = req.body;
  if (title) book.title = title;
  if (Array.isArray(details)) book.details = details;

  res.json(book);
});

app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex((book) => book.id === req.params.id);
  if (bookIndex === -1) return handleNotFound(res, 'Book not found');

  books.splice(bookIndex, 1);
  res.status(204).end();
});

app.post('/books/:id/details', (req, res) => {
  const book = findBookById(req.params.id);
  if (!book) return handleNotFound(res, 'Book not found');

  const { id, author, genre, publicationYear } = req.body;
  if (!id || !author || !genre || !publicationYear) {
    return handleBadRequest(res, 'Missing required detail fields');
  }

  const newDetail = { id, author, genre, publicationYear };
  book.details.push(newDetail);
  res.status(201).json(newDetail);
});

app.delete('/books/:id/details/:detailId', (req, res) => {
  const book = findBookById(req.params.id);
  if (!book) return handleNotFound(res, 'Book not found');

  const detail = findDetailById(book, req.params.detailId);
  if (!detail) return handleNotFound(res, 'Detail not found');

  book.details = book.details.filter((d) => d.id !== req.params.detailId);
  res.status(204).end();
});
