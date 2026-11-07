package net.javaguides.ems.controller;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.EmployeeDto;
import net.javaguides.ems.services.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

     private EmployeeService employeeService;

     @PostMapping
     public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeDto employeeDto) {

          EmployeeDto savedEmployee = employeeService.createEmployee(employeeDto);

          return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
     }

     //Get api building
     @GetMapping("{id}")
     public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable("id") Long employeeId){
               EmployeeDto employeeDto =  employeeService.getEmployeeById(employeeId);
               return ResponseEntity.ok(employeeDto);
     }

     @GetMapping
     public ResponseEntity<List<EmployeeDto>> getAllEmployees(){
          List<EmployeeDto> employees =  employeeService.getAllEmployes();
          return ResponseEntity.ok(employees);
     }

     @PutMapping("{id}")
     public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable("id") Long employeeId,@RequestBody EmployeeDto updatedEmployee){
          EmployeeDto employeeDto = employeeService.updateEmployee(employeeId,updatedEmployee);
          return ResponseEntity.ok(employeeDto);
     }
     @DeleteMapping("{id}")
     public ResponseEntity<String> deleteEmployee(@PathVariable("id") Long employeeId){
           employeeService.deleteEmployee(employeeId);
           return ResponseEntity.ok("Employee Delted Successfully");
     }
}
