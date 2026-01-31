import {setGlobalOptions} from "firebase-functions";

// Set global options for all V2 functions in this codebase
setGlobalOptions({ maxInstances: 10 });

// Exporting your Genkit flows from the other file
export * from "./genkit-sample";