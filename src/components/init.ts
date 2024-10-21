import { setConfig } from "./config";

export default function init (uuid:string, options?:{}):any {
  if (options) setConfig(options);
  setConfig({uuid});
  // @ts-ignore
  return this;
}