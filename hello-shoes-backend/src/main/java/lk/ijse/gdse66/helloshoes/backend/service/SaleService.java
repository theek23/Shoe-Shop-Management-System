package lk.ijse.gdse66.helloshoes.backend.service;

import lk.ijse.gdse66.helloshoes.backend.dto.InventoryDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.SaleDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.SaleDetailDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.basic.InventoryBasicDTO;
import lk.ijse.gdse66.helloshoes.backend.dto.basic.SaleBasicDTO;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

public interface SaleService {
    SaleDTO placeSale(@RequestBody SaleDTO saleDTO);

    List<SaleBasicDTO> getAllOrders();

    List<SaleDetailDTO> getAllOrderDetails();

    void updateSale(String id, SaleDTO saleDTO);

    String generateNewID();

    List<SaleBasicDTO> getAllOrdersFormLast3Days();

    long contActiveSales();

    double findTotalProfitOfSoldItems();

    double findTotalInventoryCost();

    List<InventoryBasicDTO> getTop4SoldItems();
}
