package eu.starthack.gomcsbackend.rest;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/loadTimeline")
public class TimelineLoadController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/{userid}")
    public ResponseEntity<List<Document>> getTimeline(@PathVariable("userid") String userId) {
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