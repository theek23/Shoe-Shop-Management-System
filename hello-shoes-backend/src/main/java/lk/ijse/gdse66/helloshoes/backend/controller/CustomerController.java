package lk.ijse.gdse66.helloshoes.backend.controller;

import lk.ijse.gdse66.helloshoes.backend.dto.CustomerDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.basic.CustomerBasicDTO;
import lk.ijse.gdse66.helloshoes.backend.entity.Customer;
import lk.ijse.gdse66.helloshoes.backend.service.CustomerService;
import lk.ijse.gdse66.helloshoes.backend.util.ResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@RestController
@RequestMapping(value = "data/customers")
@CrossOrigin(origins = "http://localhost:63342")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    List<CustomerBasicDTO> getAllCustomers(){
        return customerService.getAllCustomers();
    }
    @GetMapping(params = {"id"})
    public ResponseUtil findCustomer(String id) {
        return new ResponseUtil("Ok", "Successfully Searched", customerService.getCustomerDetails(id));
    }
    @GetMapping(params = {"contact_no"})
    public ResponseUtil findCustomerByContactNo(@RequestParam("contact_no")String contactNo) {
        return new ResponseUtil("Ok", "Successfully Searched", customerService.findCustomerByContactNo(contactNo));
    }
    @GetMapping(params = {"name"})
    List<CustomerBasicDTO> searchCustomersByName(String name) {
        return customerService.findCustomersByName(name);
    }
    @GetMapping("/NewLoyaltyMember")
    public ResponseUtil getNewID() {
        return new ResponseUtil("Ok", "Successfully Searched", customerService.generateNewID());
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    CustomerDTO saveCustomer(@RequestBody CustomerDTO customerDTO){
        return customerService.saveCustomer(customerDTO);
    }


    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil updateCustomer(@PathVariable String id,@RequestBody CustomerDTO customerDTO) {
        System.out.println("Update");
        customerService.updateCustomer(id,customerDTO);
        return new ResponseUtil("Ok", "Update Success", null);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseUtil deleteCustomer(@PathVariable String id) {
        System.out.println("Delete");
        customerService.deleteCustomer(id);
        return new ResponseUtil("Ok", "Customer Deleted Successfully", null);
    }
}
