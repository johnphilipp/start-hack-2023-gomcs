package eu.starthack.gomcsbackend.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/stats")
public class StatisticController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/{userid}")
    public ResponseEntity<Map<String, Integer>> aggregateByActivityType(@PathVariable("userid") String userId) {
        try {
            Aggregation aggregation = Aggregation.newAggregation(
                    Aggregation.group("activityType").sum("distance").as("totalDistance")
            );

            System.out.println(aggregation);
            AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, userId, Map.class);

            System.out.println(results.getMappedResults());
            Map<String, Integer> distancesByActivityType = new HashMap<>();
            for (Map map : results.getMappedResults()) {
                String activityType = (String) map.get("_id");
                int totalDistance = (Integer) map.get("totalDistance");
                distancesByActivityType.put(activityType, totalDistance);
            }
            return ResponseEntity.ok(distancesByActivityType);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
