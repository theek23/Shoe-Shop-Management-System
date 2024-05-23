package lk.ijse.gdse66.helloshoes.backend.dto.basic;

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
public class InventoryBasicDTO {
    private String itemCode;
    private String description;
    private String picture;
    private String category;
    private Integer size;
    private Double buyingPrice;
    private Double salePrice;
    private Double expectProfit;
    private Double profitMargin;
    private String status;
    private Integer qty;

}
