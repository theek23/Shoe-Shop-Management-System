package lk.ijse.gdse66.helloshoes.backend.service.impl;

import lk.ijse.gdse66.helloshoes.backend.dto.SaleDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.SaleDetailDTO;
import lk.ijse.gdse66.helloshoes.backend.entity.Inventory;
import lk.ijse.gdse66.helloshoes.backend.entity.Sale;
import lk.ijse.gdse66.helloshoes.backend.entity.SaleDetail;
import lk.ijse.gdse66.helloshoes.backend.repo.InventoryRepo;
import lk.ijse.gdse66.helloshoes.backend.repo.SaleDetailRepo;
import lk.ijse.gdse66.helloshoes.backend.repo.SaleRepo;
import lk.ijse.gdse66.helloshoes.backend.service.SaleService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    private ModelMapper modelMapper;

    public SaleServiceImpl(SaleRepo saleRepo, SaleDetailRepo saleDetailRepo, InventoryRepo inventoryRepo, ModelMapper modelMapper) {
        this.saleRepo = saleRepo;
        this.saleDetailRepo = saleDetailRepo;
        this.inventoryRepo = inventoryRepo;
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
        Sale sale = modelMapper.map(saleDTO,Sale.class);
        saleRepo.save(sale);

        //Update inventory qty in inventory entity.
        for (SaleDetail saleDetail: sale.getSaleDetail()){
            Inventory inventory = inventoryRepo.findById(saleDetail.getItemCode()).get();
            inventory.setQty(inventory.getQty()-saleDetail.getQty());
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
