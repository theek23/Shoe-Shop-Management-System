package lk.ijse.gdse66.helloshoes.backend.dto;

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
public class AdminPanelDTO {
    private String dataId;
    private Double totalSales;
    private Double totalProfit;
    private String mostSaleItem;
    private String picOfMostSaleItem;
    private Integer mostSaleItemQty;
}
