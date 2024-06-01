package lk.ijse.gdse66.helloshoes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class Sale {
    @Id
    private String orderNo;
    private Double total;
    private Timestamp purchaseDate;
    private String paymentMethod;
    private Integer lastDigitsOfCard;
    private Double addedPoints;
    private String status;
    private String customerName;
    private String employeeName;


    @ManyToOne
    @JoinColumn(name = "customerCode")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "employeeCode")
    private Employee employee;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    private List<SaleDetail> saleDetail;
}
