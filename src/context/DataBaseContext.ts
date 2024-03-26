import { Firestore } from "firebase/firestore";
import {createContext} from "react";

export interface DataBaseContext {
  db: Firestore;
}

export const DataBaseContext = createContext<DataBaseContext>({} as DataBaseContext);