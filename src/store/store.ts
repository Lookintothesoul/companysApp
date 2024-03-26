import { configureStore } from "@reduxjs/toolkit";
import companiesState from "./companiesSlice.ts";
import employeesState from "./employeesSlice.ts";

export const store = configureStore({
  reducer: {
    companies: companiesState,
    employees: employeesState,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
