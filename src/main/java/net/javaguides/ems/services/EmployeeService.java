package net.javaguides.ems.services;

import net.javaguides.ems.dto.EmployeeDto;
import net.javaguides.ems.entity.Employee;

import java.util.List;

public interface EmployeeService {
    EmployeeDto createEmployee(EmployeeDto employeeDto);

    EmployeeDto getEmployeeById(Long employeeId);

    //return type for list to build get all employess api
    List<EmployeeDto> getAllEmployes();

    //update methods
    EmployeeDto updateEmployee(Long employeeId, EmployeeDto udpatedEmployee);

    //Delete method
    void deleteEmployee(Long employeeId);
}
