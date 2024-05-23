package lk.ijse.gdse66.helloshoes.backend.service;

import lk.ijse.gdse66.helloshoes.backend.dto.InventoryDTO;

import java.util.List;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/

public interface InventoryService {
    Integer generateNewID();
    List<InventoryDTO> getAllInventories();
    InventoryDTO getInventoryDetails(String id);
    InventoryDTO saveInventory(InventoryDTO inventoryDTO);
    void updateInventory(String id, InventoryDTO inventoryDTO);
    void deleteInventory(String id);
}
