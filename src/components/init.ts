// Include external dependencies
import {
  setConfig,
  type AnalyticsConfig
} from "./config";
import recordView from "./record-view";

// Typescript definitions
type InitOptions = Partial<AnalyticsConfig> & {
  dontRecordView?: boolean
}

// The main "init" function
export default function init (uuid:string, options?:InitOptions):any {
  //TODO: improve these type definitions!

  // unpack the options for fine grain control
  const settings:InitOptions = { uuid };
  if (options) {
    if (options.nav_type) settings.nav_type = options.nav_type;
    if (options.api_url) settings.api_url = options.api_url;
  }

  // cache the config values
  setConfig(settings);

  // record the current page, unless the options toggle it off
  if (options && !options.dontRecordView) {
    recordView();
  }

  //TODO: This function, and not "watch", should make the first call to recordView.

  // @ts-ignore
  return this;
}