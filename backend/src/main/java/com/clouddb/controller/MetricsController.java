package com.clouddb.controller;

import com.clouddb.dto.MetricRequest;
import com.clouddb.model.Metric;
import com.clouddb.service.MetricsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class MetricsController {

    private final MetricsService metricsService;

    @GetMapping("/instance/{instanceId}")
    public ResponseEntity<List<Metric>> getMetrics(@PathVariable Long instanceId) {
        return ResponseEntity.ok(metricsService.getMetricsByInstance(instanceId));
    }

    @PostMapping
    public ResponseEntity<Metric> saveMetric(@Valid @RequestBody MetricRequest request) {
        return ResponseEntity.ok(metricsService.saveMetric(request));
    }
}
