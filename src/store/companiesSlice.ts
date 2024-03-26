import { createSlice } from "@reduxjs/toolkit";

export type TCompany = {
  id: string;
  companyName: string;
  companyLocation: string;
  employeesCount: number;
};

export interface CompaniesState {
  companies: TCompany[];
  openedCompanyId: string | null;
}

const initialState: CompaniesState = {
  companies: [],
  openedCompanyId: null,
};

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    addCompany: (
      state,
      { payload }: { payload: TCompany },
    ) => {
      state.companies.push(payload);
    },
    removeCompanies: (state, action: { payload: string[] }) => {
      state.companies = state.companies.filter(
        (company) => !action.payload.includes(company.id),
      );
    },
    editCompany: (state, action) => {
      const company = state.companies.find(
        (company) => company.id === action.payload.id,
      );
      if (company) {
        company.companyName = action.payload.name;
        company.companyLocation = action.payload.location;
      }
    },
    setCompanyEmployeesCount: (
      state,
      action: { payload: { id: string; employeesCount: number } },
    ) => {
      const company = state.companies.find(
        (company) => company.id === action.payload.id,
      );

      if (company) {
        company.employeesCount = action.payload.employeesCount;
      }
    },
    setOpenedCompanyId: (state, action: { payload: string | null }) => {
      state.openedCompanyId = action.payload;
    },
    setCompanies: (state, action: { payload: TCompany[] }) => {
      state.companies = action.payload;
    }
  },
});

export const {
  addCompany,
  removeCompanies,
  editCompany,
  setCompanyEmployeesCount,
  setOpenedCompanyId,
  setCompanies
} = companiesSlice.actions;

export default companiesSlice.reducer;
