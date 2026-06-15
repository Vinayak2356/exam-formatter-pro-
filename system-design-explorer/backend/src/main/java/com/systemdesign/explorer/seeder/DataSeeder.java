package com.systemdesign.explorer.seeder;

import com.systemdesign.explorer.entity.DesignPattern;
import com.systemdesign.explorer.entity.Role;
import com.systemdesign.explorer.entity.User;
import com.systemdesign.explorer.repository.DesignPatternRepository;
import com.systemdesign.explorer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DesignPatternRepository patternRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin
        if (userRepository.findByEmail("admin@systemdesign.com").isEmpty()) {
            userRepository.save(User.builder()
                    .email("admin@systemdesign.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build());
        }

        // Seed Patterns
        if (patternRepository.count() == 0) {
            List<DesignPattern> initialPatterns = List.of(
                    createPattern("Load Balancing", "Distribute traffic across multiple servers", "Added complexity", "Architecture", "Low"),
                    createPattern("Horizontal Scaling", "Add more machines to your resource pool", "Data consistency is harder", "Scaling", "Medium"),
                    createPattern("Database Sharding", "Split DB horizontally across multiple nodes", "Complex queries and joins across shards", "Database", "High"),
                    createPattern("Read Replicas", "Offload read-heavy traffic from primary DB", "Replication lag", "Database", "Low"),
                    createPattern("Consistent Hashing", "Minimize key redistribution on node failure", "Complex to implement evenly", "Algorithms", "High"),
                    createPattern("Cache-Aside", "Application handles cache logic directly", "Potential cache misses (latency penalty)", "Caching", "Low"),
                    createPattern("Write-Through Cache", "Write to cache and DB simultaneously", "Higher write latency", "Caching", "Medium"),
                    createPattern("Write-Behind Cache", "Write to cache, async to DB", "Risk of data loss on crash", "Caching", "High"),
                    createPattern("CDN", "Deliver static content globally from edge", "Cache invalidation is hard", "Performance", "Low"),
                    createPattern("Materialized Views", "Pre-calculate complex query results", "Data staleness", "Database", "Medium"),
                    createPattern("Event Sourcing", "Store sequence of state-changing events", "Large storage, difficult to query current state", "Architecture", "High"),
                    createPattern("CQRS", "Separate Read and Write models", "Increased complexity, eventual consistency", "Architecture", "High"),
                    createPattern("Data Partitioning", "Divide data into manageable chunks", "Cross-partition operations", "Database", "Medium"),
                    createPattern("Distributed Transactions", "Maintain ACID across multiple systems", "High latency, prone to failure (2PC)", "Database", "High"),
                    createPattern("Saga Pattern", "Sequence of local transactions with compensation", "Difficult to trace and debug", "Architecture", "High"),
                    createPattern("Message Queue", "Asynchronous point-to-point communication", "Message ordering issues", "Messaging", "Medium"),
                    createPattern("Publish-Subscribe", "Broadcast messages to multiple consumers", "Consumer scaling and deduplication", "Messaging", "Medium"),
                    createPattern("Event-Driven Architecture", "System reacts to state changes asynchronously", "Traceability and debugging", "Architecture", "High"),
                    createPattern("Stream Processing", "Process infinite data streams continuously", "Complex state management", "Data Processing", "High"),
                    createPattern("Webhook Pattern", "HTTP push API for event notification", "Delivery failures and retries", "Integration", "Low"),
                    createPattern("Circuit Breaker", "Fail fast to prevent cascading failures", "State management complexity", "Resilience", "Medium"),
                    createPattern("Retry Pattern", "Transient failure recovery", "Can overload struggling systems (thundering herd)", "Resilience", "Low"),
                    createPattern("Bulkhead", "Isolate failures to specific components", "Resource under-utilization", "Resilience", "Medium"),
                    createPattern("Rate Limiting", "Control flow of traffic", "Dropping legitimate traffic", "API Management", "Medium"),
                    createPattern("Failover", "Switch to redundant system on failure", "Cost of redundant hardware", "Resilience", "High"),
                    createPattern("Leader Election", "Designate a single node as coordinator", "Split-brain problems", "Distributed Systems", "High"),
                    createPattern("Service Discovery", "Dynamic location of microservices", "Added infrastructure dependency", "Microservices", "Medium"),
                    createPattern("API Gateway", "Single entry point for client requests", "Single point of failure and bottleneck", "Microservices", "Medium"),
                    createPattern("Sidecar Pattern", "Deploy utility components alongside app", "Higher resource consumption", "Microservices", "Medium"),
                    createPattern("Service Mesh", "Infrastructure layer for service-to-service communication", "Extremely complex configuration", "Microservices", "High")
            );
            patternRepository.saveAll(initialPatterns);
        }
    }

    private DesignPattern createPattern(String name, String pick, String tradeoff, String category, String complexity) {
        return DesignPattern.builder()
                .name(name)
                .pickItWhen(pick)
                .mainTradeOff(tradeoff)
                .category(category)
                .complexityLevel(complexity)
                .realWorldExamples("Example usages for " + name + " in production systems.")
                .detailDescription("Detailed breakdown of " + name + " architecture, sequence diagrams, and best practices.")
                .build();
    }
}
