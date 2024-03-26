import "./App.css";
import { CompaniesTable } from "./Components/CompaniesTable.tsx";
import { EmployeesTable } from "./Components/EmployeesTable.tsx";

function App() {
  return (
    <>
      <main>
        <div>
          <CompaniesTable />
          <EmployeesTable />
        </div>
        <span style={{ fontSize: 16 }}>
          Для изменения данных, нужно ввести новое значение и нажать "Enter"
        </span>
      </main>
    </>
  );
}

export default App;
