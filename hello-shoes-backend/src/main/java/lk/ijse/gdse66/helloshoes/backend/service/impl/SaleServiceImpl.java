package lk.ijse.gdse66.helloshoes.backend.service.impl;

import lk.ijse.gdse66.helloshoes.backend.dto.CustomerDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.EmployeeDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.SaleDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.SaleDetailDTO;
import lk.ijse.gdse66.helloshoes.backend.entity.*;
import lk.ijse.gdse66.helloshoes.backend.repo.*;
import lk.ijse.gdse66.helloshoes.backend.service.SaleService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Service
@Transactional
public class SaleServiceImpl implements SaleService {
    private SaleRepo saleRepo;
    private SaleDetailRepo saleDetailRepo;
    private InventoryRepo inventoryRepo;
    private CustomerRepo customerRepo;
    private EmployeeRepo employeeRepo;

    private ModelMapper modelMapper;

    public SaleServiceImpl(SaleRepo saleRepo, SaleDetailRepo saleDetailRepo, InventoryRepo inventoryRepo, CustomerRepo customerRepo, EmployeeRepo employeeRepo, ModelMapper modelMapper) {
        this.saleRepo = saleRepo;
        this.saleDetailRepo = saleDetailRepo;
        this.inventoryRepo = inventoryRepo;
        this.customerRepo = customerRepo;
        this.employeeRepo = employeeRepo;
        this.modelMapper = modelMapper;
    }

    @Override
    public String generateNewID() {
        String lastID = saleRepo.findLastOrderCode();

        if (lastID == null){
            return "O00001";
        }
        String numericPart = lastID.substring(5);
        int numericValue = Integer.parseInt(numericPart);

        // Increment the numeric value
        numericValue++;

        // Format the new ID with leading zeros
        String newID = String.format("O%05d", numericValue);

        return newID;
    }

    @Override
    public SaleDTO placeSale(SaleDTO saleDTO) {
        Customer customer = customerRepo.findById(saleDTO.getCustomer().getCustomerCode())
                .orElseThrow(() -> new NoSuchElementException("Customer not found with code: " + saleDTO.getCustomer().getCustomerCode()));
        Employee employee = employeeRepo.findById(saleDTO.getEmployee().getEmployeeCode())
                .orElseThrow(() -> new NoSuchElementException("Employee not found with code: " + saleDTO.getEmployee().getEmployeeCode()));

        Sale sale = modelMapper.map(saleDTO, Sale.class);
        sale.setCustomer(customer);
        sale.setEmployee(employee);
        sale.setCustomerName(customer.getName());
        sale.setEmployeeName(employee.getName());
        saleRepo.save(sale);

        // Update inventory qty in inventory entity.
        for (SaleDetail saleDetail : sale.getSaleDetail()) {
            Inventory inventory = inventoryRepo.findById(saleDetail.getItemCode())
                    .orElseThrow(() -> new NoSuchElementException("Inventory not found with item code: " + saleDetail.getItemCode()));
            inventory.setQty(inventory.getQty() - saleDetail.getQty());
            inventoryRepo.save(inventory);
        }
        return saleDTO;
    }


    @Override
    public List<SaleDTO> getAllOrders() {
        return saleRepo.findAll().stream().map(
                sale -> modelMapper.map(sale, SaleDTO.class)).toList();
    }

    @Override
    public List<SaleDetailDTO> getAllOrderDetails() {
        return saleDetailRepo.findAll().stream().map(
                saleDetail -> modelMapper.map(saleDetail, SaleDetailDTO.class)).toList();
    }
    //Refund Only
    @Override
    public void updateSale(String id, SaleDTO saleDTO) {
        Sale existingSale = saleRepo.findById(id).orElseThrow(() -> new RuntimeException("Inventory not found with ID: " + id));
        modelMapper.map(saleDTO, existingSale);
        saleRepo.save(existingSale);
    }
}
