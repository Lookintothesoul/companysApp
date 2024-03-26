import { createSlice } from "@reduxjs/toolkit";

export type TEmployee = {
  id: string;
  companyId: string;
  employeeFirstName: string;
  employeeSecondName: string;
  employeePosition: string;
};

export interface EmployeesState {
  employees: TEmployee[];
}

const initialState: EmployeesState = {
  employees: [],
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee: (
      state,
      {
        payload,
      }: {
        payload: TEmployee;
      },
    ) => {
      state.employees.push({...payload});
    },
    removeEmployees: (state, action: { payload: string[] }) => {
      state.employees = state.employees.filter(
        (employee) => !action.payload.includes(employee.id),
      );
    },
    editEmployee: (state, action) => {
      const employee = state.employees.find(
        (employee) => employee.id === action.payload.id,
      );

      if (employee) {
        employee.employeeFirstName = action.payload.employeeFirstName;
        employee.employeeSecondName = action.payload.employeeSecondName;
        employee.employeePosition = action.payload.employeePosition;
      }
    },
    setEmployees: (state, action: { payload: TEmployee[] }) => {
      state.employees = action.payload;
    },
  },
});

export const { addEmployee, removeEmployees, editEmployee, setEmployees } =
  employeesSlice.actions;

export default employeesSlice.reducer;
