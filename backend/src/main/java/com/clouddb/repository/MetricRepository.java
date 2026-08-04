package com.clouddb.repository;

import com.clouddb.model.Metric;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MetricRepository extends JpaRepository<Metric, Long> {
    List<Metric> findByInstanceIdOrderByTimestampDesc(Long instanceId);
}