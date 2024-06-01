package lk.ijse.gdse66.helloshoes.backend.dto.basic;


import lk.ijse.gdse66.helloshoes.backend.entity.Customer;
import lk.ijse.gdse66.helloshoes.backend.entity.Employee;
import lk.ijse.gdse66.helloshoes.backend.entity.SaleDetail;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaleBasicDTO {
    private String orderNo;
    private Double total;
    private Timestamp purchaseDate;
    private String paymentMethod;
    private Integer lastDigitsOfCard;
    private Double addedPoints;
    private String status;
}
