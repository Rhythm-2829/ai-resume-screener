package com.rhythm.resumescreener.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor 
public class QuotaResponse {
    private int used;
    private int limit;
    private int remaining;
}
