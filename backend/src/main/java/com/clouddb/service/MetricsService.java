package com.clouddb.service;

import com.clouddb.dto.MetricRequest;
import com.clouddb.model.Instance;
import com.clouddb.model.Metric;
import com.clouddb.repository.InstanceRepository;
import com.clouddb.repository.MetricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MetricsService {

    private final MetricRepository metricRepository;
    private final InstanceRepository instanceRepository;

    public List<Metric> getMetricsByInstance(Long instanceId) {
        return metricRepository.findByInstanceIdOrderByTimestampDesc(instanceId);
    }

    public Metric saveMetric(MetricRequest request) {
        Instance instance = instanceRepository.findById(request.getInstanceId())
                .orElseThrow(() -> new RuntimeException("Instance not found"));

        Metric metric = Metric.builder()
                .cpuUsage(request.getCpuUsage())
                .memoryUsage(request.getMemoryUsage())
                .diskUsage(request.getDiskUsage())
                .instance(instance)
                .build();

        return metricRepository.save(metric);
    }
}