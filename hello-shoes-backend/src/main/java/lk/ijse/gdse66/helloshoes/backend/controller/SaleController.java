package lk.ijse.gdse66.helloshoes.backend.controller;

import lk.ijse.gdse66.helloshoes.backend.dto.SaleDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.SaleDetailDTO;
import lk.ijse.gdse66.helloshoes.backend.service.SaleService;
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
@RequestMapping(value = "data/sale")
public class SaleController {
    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }
    //GetALL
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE,path = "/Sales")
    List<SaleDTO> getAllSales(){
        System.out.println("request received");
        return saleService.getAllOrders();
    }
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE,path = "/SaleDetails")
    List<SaleDetailDTO> getAllSaleDetails(){
        System.out.println("request received");
        return saleService.getAllOrderDetails();
    }

    //Save
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    SaleDTO saveSale(@RequestBody SaleDTO saleDto){
        return saleService.placeSale(saleDto);
    }

    //Update
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil updateVehicle(@PathVariable String id,@RequestBody SaleDTO saleDto) {
        System.out.println(saleDto);
        saleService.updateSale(id,saleDto);
        return new ResponseUtil("Ok", "Update Success", null);
    }
}
