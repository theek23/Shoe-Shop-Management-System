package lk.ijse.gdse66.helloshoes.backend.controller;

import lk.ijse.gdse66.helloshoes.backend.dto.SupplierDTO;
import lk.ijse.gdse66.helloshoes.backend.service.SupplierService;
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
@RequestMapping(value = "data/suppliers")
@CrossOrigin(origins = "http://localhost:63342")
public class SupplierController {
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    //GetALL
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    List<SupplierDTO> getAllSuppliers(){
        System.out.println("request received");
        return supplierService.getAllSuppliers();
    }

    //GetDetails
    @GetMapping(params = {"id"})
    public ResponseUtil findSupplier(String id) {
        return new ResponseUtil("Ok", "Successfully Searched", supplierService.getSupplierDetails(id));
    }
    //searchByName
    @GetMapping(params = {"name"})
    List<SupplierDTO> searchSuppliersByName(String name) {
        return supplierService.findSuppliersByName(name);
    }
    //NewID
    @GetMapping("/getId")
    public ResponseUtil getNewID() {
        return new ResponseUtil("Ok", "Successfully Searched", supplierService.generateNewID());
    }

    //Save
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    SupplierDTO saveSupplier(@RequestBody SupplierDTO supplierDTO){
        System.out.println(supplierDTO);
        return supplierService.saveSupplier(supplierDTO);
    }

    //Update
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil updateSupplier(@PathVariable String id,@RequestBody SupplierDTO supplierDTO) {
        System.out.println(supplierDTO);
        supplierService.updateSupplier(id,supplierDTO);
        return new ResponseUtil("Ok", "Update Success", null);
    }

    //Delete
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseUtil deleteSupplier(@PathVariable String id) {
        System.out.println("Request received to delete Supplier with ID: " + id);
        supplierService.deleteSupplier(id);
        return new ResponseUtil("Ok", "Supplier Deleted Successfully", null);
    }
}
