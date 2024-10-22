// Include external dependencies
import { getConfig } from "./config";
import getURL from "./get-url";
import recordView from "./record-view";

const unwatchers:Array<()=>any> = [];

export default function watch():any {
  const { nav_type } = getConfig();

  if (nav_type === "hash") {
    // Capture the current URL to use as the referrer later
    let referrer = getURL();
    function nndev_listener () {
      const url = getURL();
      recordView(url, referrer);
      referrer = url;
    };
    window.addEventListener("hashchange", nndev_listener);
    unwatchers.push(function () {
      window.removeEventListener("hashchange", nndev_listener);
    });
  } else if (nav_type === "history") {
    throw new Error(`TODO: Implement the history watch functionality`);
  }

  // @ts-ignore
  return this;
}

export const unwatch = function () {
  unwatchers.forEach(un => un());
}