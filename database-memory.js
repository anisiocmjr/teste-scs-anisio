import { randomUUID } from "crypto";

export class DatabaseMemory {
  #products = new Map();

  list(search) {
    return Array.from(this.#products.entries()).map((productArray) => {
      const id = productArray[0];
      const data = productArray[1];

      return {
        id,
        ...data,
      };
    })
    .filter(product => {
      if (search) {
        return product.name.includes(search);
      }

      return true;
    });
  }

  findByName(name) {
    for (const [id, product] of this.#products.entries()) {
      if (product.name === name) {
        return { id, ...product };
      }
    }
    return null; 
  }

  create(product) {
    const productId = randomUUID();
    this.#products.set(productId, product);
  }

  update(id, product) {
    this.#products.set(id, product);
  }

  delete(id) {
    this.#products.delete(id);
  }
}
