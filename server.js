import { fastify } from "fastify";
import { DatabaseMemory } from "./database-memory.js";

const server = fastify();

const database = new DatabaseMemory();

const createProductSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: {
        type: 'string',
        maxLength: 500,
      },
      price: { type: 'number', minimum: 0 },
      stock: { type: 'integer', minimum: 0 },
    },
    required: ['name', 'description', 'price', 'stock'],
  },

  check: {
    price: (value) => {
      if (value < 0) {
        return { error: 'O preço deve ser um número positivo.' };
      }
      return true;
    },
    
    stock: (value) => {
      if (value < 0) {
        return { error: 'O estoque deve ser um número inteiro positivo.' };
      }
      return true;
    },
  },
};

server.post('/products', (request, reply) => {
  const { name, description, price, stock } = request.body;

  const errors = [];

  const existingProduct = database.findByName(name);
  if (existingProduct) {
    errors.push("Um produto com este nome já existe.");
  }

  if (price < 0) {
    errors.push("O preço deve ser um número positivo.");
  }

  if (stock < 0) {
    errors.push("O estoque deve ser um número inteiro positivo.");
  }

  if (errors.length > 0) {
    return reply.status(400).send({ errors });
  }

  database.create({
    name,
    description,
    price,
    stock,
  });

  return reply.status(201).send();
});

server.get('/products', (request) => {
  const search = request.query.search;

  const products = database.list(search);

  return products;
});

server.put('/products/:id', (request, reply) => {
  const productId = request.params.id;
  const { name, description, price, stock } = request.body;

  database.update(productId, {
    name,
    description,
    price,
    stock,
  });

  return reply.status(204).send();
});

server.delete('/products/:id', (request, reply) => {
  const productId = request.params.id;

  database.delete(productId);

  return reply.status(204).send();
});

server.listen({
  port: 3333,
});