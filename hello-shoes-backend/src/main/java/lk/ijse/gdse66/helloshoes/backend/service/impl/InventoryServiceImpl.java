package lk.ijse.gdse66.helloshoes.backend.service.impl;

import lk.ijse.gdse66.helloshoes.backend.dto.InventoryDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.InventoryDTO;
import lk.ijse.gdse66.helloshoes.backend.entity.Inventory;
import lk.ijse.gdse66.helloshoes.backend.repo.InventoryRepo;
import lk.ijse.gdse66.helloshoes.backend.service.InventoryService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.UUID;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Service
@Transactional
public class InventoryServiceImpl implements InventoryService{
    private InventoryRepo inventoryRepo;
    private ModelMapper modelMapper;

    public InventoryServiceImpl(InventoryRepo inventoryRepo, ModelMapper modelMapper) {
        this.inventoryRepo = inventoryRepo;
        this.modelMapper = modelMapper;
    }

    @Override
    public Integer generateNewID() {
        String lastID = inventoryRepo.findLastInventoryCode();

        if (lastID == null){
            return 00001;
        }
        String numericPart = lastID.substring(5);
        int numericValue = Integer.parseInt(numericPart);

        // Increment the numeric value
        numericValue++;

        // Format the new ID with leading zeros
        Integer newID = numericValue;

        return newID;
    }

    @Override
    public List<InventoryDTO> getAllInventories() {
        return inventoryRepo.findAll().stream().map(
                inventories -> modelMapper.map(inventories, InventoryDTO.class)).toList();
    }

    @Override
    public InventoryDTO getInventoryDetails(String id) {
        if (!inventoryRepo.existsById(id)) throw new RuntimeException("Id not exists !");
        return modelMapper.map(inventoryRepo.findById(id).get(), InventoryDTO.class);
    }

    @Override
    public InventoryDTO saveInventory(InventoryDTO inventoryDTO) {
        if (inventoryDTO.getItemCode() == null || inventoryDTO.getItemCode().isEmpty()) {
            inventoryDTO.setItemCode(UUID.randomUUID().toString()); // Generate new UUID only if necessary
        }
        byte[] imageBytes = Base64.getDecoder().decode(inventoryDTO.getPicture());
        Inventory inventoryEntity = modelMapper.map(inventoryDTO, Inventory.class);
        inventoryEntity.setPicture(imageBytes);
        Inventory savedInventory = inventoryRepo.save(inventoryEntity);
        return modelMapper.map(savedInventory, InventoryDTO.class);
    }

    @Override
    public void updateInventory(String id, InventoryDTO inventoryDTO) {
        Inventory existingInventory = inventoryRepo.findById(id).orElseThrow(() -> new RuntimeException("Inventory not found with ID: " + id));
        modelMapper.map(inventoryDTO, existingInventory);
        inventoryRepo.save(existingInventory);
    }

    @Override
    public void deleteInventory(String id) {
        if (!inventoryRepo.existsById(id)) {
            throw new RuntimeException("Cannot delete as inventory does not exist with ID: " + id);
        }
        inventoryRepo.deleteById(id);
    }
}
