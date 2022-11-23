import { v4 as uuid4 } from "uuid";
import { types } from "mobx-state-tree";

// Define a couple models
const Author = types.model({
  id: types.identifier,
  firstName: types.string,
  lastName: types.string,
});
const Tweet = types.model({
  id: types.identifier,
  author: types.reference(Author), // stores just the `id` reference!
  body: types.string,
  timestamp: types.number,
});

export const OtherStore = types
  .model({
    authors: types.array(Author),
  })
  .actions((self) => ({
    createAuthor(firstName = "Foo", lastName = "Bar") {
      self.authors.push({
        id: uuid4(),
        firstName,
        lastName,
      });
    },
  }));

// Define a store just like a model
export const RootStore = types
  .model({
    authors: types.array(Author),
    tweets: types.array(Tweet),
  })
  .actions((self) => ({
    generateTweets(count) {
      const authorId = uuid4();
      self.authors.push({
        id: authorId,
        firstName: `John ${authorId}`,
        lastName: "Doe",
      });

      for (let i = 0; i < count; i++) {
        self.tweets.push({
          id: uuid4(),
          author: authorId,
          body: `This is tweet ${i}`,
          timestamp: Date.now(),
        });
      }
    },
  }));
