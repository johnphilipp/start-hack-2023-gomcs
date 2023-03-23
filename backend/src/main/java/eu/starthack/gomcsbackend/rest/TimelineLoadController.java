package eu.starthack.gomcsbackend.rest;

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
    public ResponseEntity<List<Document>> getTimeline(@PathVariable("userid") String userId) {
        LOGGER.info("GET timeline for " + userId);
        try {
            Query query = new Query(Criteria.where("userId").is(userId));
            List<Document> timeline = mongoTemplate.find(query, Document.class, "timeline");

            List<Document> timelineProcessed = new ArrayList<>();

            timeline.stream().forEach(document -> {
                Document timelineDocument = (Document) document.get("timeline");
                timelineProcessed.add(timelineDocument);
            });

            if (timeline.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
            }
            return ResponseEntity.ok(timelineProcessed);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}