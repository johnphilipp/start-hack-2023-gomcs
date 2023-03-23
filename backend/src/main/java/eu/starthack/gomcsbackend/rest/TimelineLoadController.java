package eu.starthack.gomcsbackend.rest;

import eu.starthack.gomcsbackend.domain.ActivitySegment;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/loadTimeline")
public class TimelineLoadController {
    private static final Logger LOGGER = LogManager.getLogger(TimelineLoadController.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{userid}")
    public ResponseEntity<List<ActivitySegment>> getTimeline(@PathVariable("userid") String userId) {
        LOGGER.info("GET timeline for " + userId);
        try {
            List<ActivitySegment> timeline = mongoTemplate.findAll(ActivitySegment.class, userId);

            if (timeline.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }
            return ResponseEntity.ok(timeline);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}