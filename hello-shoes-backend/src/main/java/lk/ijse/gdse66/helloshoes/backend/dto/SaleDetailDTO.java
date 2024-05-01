package lk.ijse.gdse66.helloshoes.backend.dto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ManyToOne;
import lk.ijse.gdse66.helloshoes.backend.entity.Inventory;
import lk.ijse.gdse66.helloshoes.backend.entity.Sale;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaleDetailDTO {
    private String itemCode;
    private String orderNo;
    private Integer qty;

    private Sale sale;
    private Inventory inventory;
}
