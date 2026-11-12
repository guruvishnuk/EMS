import { useEffect, useState } from "react";
import type { Employee } from "@/types/employee";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "@/services/employeeServices";

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const handleDeleteEmployee = async (id?: number) => {
    if (!id) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?",
    );
    if (!confirmed) return;
    try {
      await deleteEmployee(id);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== id),
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || emp.email.toLowerCase().includes(query);
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h2 className="text-2xl font-bold">Employee Directory</h2>
          <p className="text-sm text-gray-500">
            Total Employees: {employees.length}
          </p>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded transition-colors self-start sm:self-auto"
          onClick={() => {
            setEditingEmployee(null);
            setShowModal(true);
          }}
        >
          + Add Employee
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search by employee name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2.5 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredEmployees.length === 0 ? (
        <p className="text-gray-500 py-6 text-center">
          {searchQuery
            ? "No employees match your search."
            : "No employees in database. Click '+ Add Employee' to create one."}
        </p>
      ) : (
        <div className="grid gap-3">
          {filteredEmployees.map((employee) => {
            return (
              <div
                key={employee.id}
                className="border p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {employee.firstName.toLocaleUpperCase()}{" "}
                    {employee.lastName.toLocaleUpperCase()}{" "}
                    <span className="text-xs font-mono text-gray-400">
                      #{employee.id}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    {employee.email.toLocaleLowerCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                    onClick={() => {
                      setEditingEmployee(employee);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Employee" : "Add New Employee"}
        </h2>
        <form
          className="space-y-3"
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
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              required
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="border p-2 rounded w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              required
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="border p-2 rounded w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border p-2 rounded w-full text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isEditing ? "Save Changes" : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
