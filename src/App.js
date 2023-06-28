import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { destroy } from "mobx-state-tree";
import { OtherStore, RootStore } from "./models/RootStore";

class SDKWithSet {
  static instances = new Set();

  constructor() {
    // storing this on a class property never allows the store to be later garbage collected
    this.store = RootStore.create({ authors: [], tweets: [] });
    SDKWithSet.instances.add(this);
  }

  destroy() {
    destroy(this.store);
    SDKWithSet.instances.delete(this);
  }
}

const instances = new WeakMap();

class SDKWithWeakMap {
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

export const SDK_KEYS = {
  SET: "a",
  WEAK_MAP: "b"
}
const SDKS = {
  [SDK_KEYS.SET]: SDKWithSet,
  [SDK_KEYS.WEAK_MAP]: SDKWithWeakMap,
}

const App = ({sdk}) => {
  const SDK = SDKS[sdk];
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
