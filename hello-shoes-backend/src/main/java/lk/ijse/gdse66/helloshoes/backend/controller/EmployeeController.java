package lk.ijse.gdse66.helloshoes.backend.controller;

import lk.ijse.gdse66.helloshoes.backend.dto.EmployeeDTO;
import lk.ijse.gdse66.helloshoes.backend.service.EmployeeService;
import lk.ijse.gdse66.helloshoes.backend.util.ResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@RestController
@RequestMapping(value = "data/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    //GetALL
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    List<EmployeeDTO> getAllEmployees(){
        System.out.println("request received");
        return employeeService.getAllEmployees();
    }

    //GetDetails
    @GetMapping(params = {"id"})
    public ResponseUtil findEmployee(String id) {
        return new ResponseUtil("Ok", "Successfully Searched", employeeService.getEmployeeDetails(id));
    }

    //Save
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    EmployeeDTO saveEmployee(@RequestBody EmployeeDTO employeeDTO){
        return employeeService.saveEmployee(employeeDTO);
    }

    //Update
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil updateVehicle(@PathVariable String id,@RequestBody EmployeeDTO employeeDTO) {
        System.out.println(employeeDTO);
        employeeService.updateEmployee(id,employeeDTO);
        return new ResponseUtil("Ok", "Update Success", null);
    }

    //Delete
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseUtil deleteEmployee(@PathVariable String id) {
        System.out.println("Request received to delete supplier with ID: " + id);
        employeeService.deleteEmployee(id);
        return new ResponseUtil("Ok", "Employee Deleted Successfully", null);
    }
}
