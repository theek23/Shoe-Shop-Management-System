package lk.ijse.gdse66.helloshoes.backend.controller;

import lk.ijse.gdse66.helloshoes.backend.dto.InventoryDTO;
import lk.ijse.gdse66.helloshoes.backend.service.InventoryService;
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
@RequestMapping(value = "data/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    //GetALL
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    List<InventoryDTO> getAllInventory(){
        System.out.println("request received");
        return inventoryService.getAllInventories();
    }

    //GetDetails
    @GetMapping(params = {"id"})
    public ResponseUtil findInventory(String id) {
        return new ResponseUtil("Ok", "Successfully Searched", inventoryService.getInventoryDetails(id));
    }
    @GetMapping("/getId")
    public ResponseUtil getNewID() {
        System.out.println(inventoryService.generateNewID());
        return new ResponseUtil("Ok", "Successfully Searched", inventoryService.generateNewID());
    }
    //Save
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    InventoryDTO saveInventory(@RequestBody InventoryDTO inventoryDTO){
        System.out.println(inventoryDTO);
        return inventoryService.saveInventory(inventoryDTO);
    }

    //Update
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil updateInventory(@PathVariable String id,@RequestBody InventoryDTO inventoryDTO) {
        System.out.println(inventoryDTO);
        inventoryService.updateInventory(id,inventoryDTO);
        return new ResponseUtil("Ok", "Update Success", null);
    }

    //Delete
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseUtil deleteInventory(@PathVariable String id) {
        System.out.println("Request received to delete Inventory with ID: " + id);
        inventoryService.deleteInventory(id);
        return new ResponseUtil("Ok", "Inventory Deleted Successfully", null);
    }
}
