package com.clouddb.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MetricRequest {
    
    @NotNull(message = "CPU usage is required")
    private Double cpuUsage;
    
    @NotNull(message = "Memory usage is required")
    private Double memoryUsage;
    
    @NotNull(message = "Disk usage is required")
    private Double diskUsage;
    
    @NotNull(message = "Instance ID is required")
    private Long instanceId;
}