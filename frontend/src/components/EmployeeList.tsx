import { useEffect, useState } from "react";
import type { Employee } from "@/types/employee";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
} from "@/services/employeeServices";

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    setLoader(true);
    setError(null);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loader) {
    return <p>Loading....</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleAddEmployee = async (newEmployee: Omit<Employee, "id">) => {
    setLoader(true);
    setError(null);
    try {
      const createdEmployee = await createEmployee(newEmployee);
      setEmployees((prevEmployees) => [...prevEmployees, createdEmployee]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const handleUpdateEmployee = async (updateEmp: Employee) => {
    setLoader(true);
    setError(null);
    try {
      const data = await updateEmployee(updateEmp);
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) => (emp.id === data.id ? data : emp)),
      );
      setEditingEmployee(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      <button
        className="bg-green-500 text-white p-2 rounded"
        onClick={() => {
          setEditingEmployee(null);
          setShowModal(true);
        }}
      >
        Add Employee
      </button>
      <h1>{employees.length} Employees</h1>
      {employees.map((employee) => {
        return (
          <div key={employee.id}>
            <h3 className="bg-yellow-200 m-1 p-2">
              Employee Name : {employee.firstName.toLocaleUpperCase()}{" "}
              {employee.lastName.toLocaleUpperCase()}
            </h3>
            <p className=" bg-blue-200 m-1 p-2">
              Employee Email : {employee.email.toLocaleLowerCase()}
            </p>
            <button
              className="bg-yellow-500 text-white p-2 rounded"
              onClick={() => {
                setEditingEmployee(employee);
                setShowModal(true);
              }}
            >
              Edit Employee
            </button>
          </div>
        );
      })}
      {showModal && (
        <CreateModal
          initialData={editingEmployee}
          onSubmit={(data) => {
            if ("id" in data && data.id) {
              handleUpdateEmployee(data as Employee);
            } else {
              handleAddEmployee(data);
            }
            setShowModal(false);
          }}
          onClose={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
        />
      )}
    </div>
  );
}

type EmployeeProps = {
  initialData?: Employee | null;
  onSubmit: (data: Employee | Omit<Employee, "id">) => void;
  onClose: () => void;
};

export const CreateModal = ({
  initialData,
  onSubmit,
  onClose,
}: EmployeeProps) => {
  const isEditing = Boolean(initialData && initialData?.id);

  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
  });

  return (
    <div>
      <h1>{isEditing ? "Edit" : "Add"} Employee </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isEditing && initialData?.id) {
            onSubmit({ id: initialData.id, ...formData });
          } else {
            onSubmit(formData);
          }
          onClose();
        }}
      >
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <button type="submit">
          {isEditing ? "Update Employee" : "Add Employee"}
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};
