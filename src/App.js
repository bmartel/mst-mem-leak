import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { destroy } from "mobx-state-tree";
import { OtherStore, RootStore } from "./models/RootStore";

// class SDK {
//   static instances = new Set();

//   constructor() {
//     // storing this on a class property never allows the store to be later garbage collected
//     this.store = RootStore.create({ authors: [], tweets: [] });
//     SDK.instances.add(this);
//   }

//   destroy() {
//     destroy(this.store);
//     SDK.instances.delete(this);
//   }
// }

const instances = new WeakMap();

class SDK {
  constructor() {
    // storing this in a WeakMap allows the store to be later garbage collected
    instances.set(this, RootStore.create({ authors: [], tweets: [] }));
  }

  get store() {
    return instances.get(this);
  }

  destroy() {
    destroy(this.store);
    instances.delete(this);
  }
}

const Tweets = observer(({ sdk }) => {
  useEffect(() => {
    return () => {
      sdk.destroy();
      console.log("destroyed");
    };
  }, [sdk]);

  return (
    <div>
      <p>
        {sdk.store.tweets.length} Tweets, {sdk.store.authors.length} Authors
        <br />
      </p>
      <button onClick={() => sdk.store.generateTweets(10000)}>
        Add 10000 Tweets
      </button>
    </div>
  );
});

const App = () => {
  const otherStore = useMemo(() => OtherStore.create({ authors: [] }), []);
  const [showTweets, setShowTweets] = useState(true);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Memory Leaks</h1>
        <button onClick={() => setShowTweets((prev) => !prev)}>
          Toggle Tweets
        </button>
        {showTweets && <Tweets sdk={new SDK()} />}
        <p>
          {otherStore.authors.length} Authors in OtherStore
          <br />
        </p>
        <button onClick={() => otherStore.createAuthor()}>Add Author</button>
      </header>
    </div>
  );
};

export default observer(App);
