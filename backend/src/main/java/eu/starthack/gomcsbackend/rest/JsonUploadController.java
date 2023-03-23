package eu.starthack.gomcsbackend.rest;


import org.bson.Document;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RestController;



import java.util.Map;

@RestController
public class JsonUploadController {
    private final MongoTemplate mongoTemplate;

    public JsonUploadController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/uploadJsonTimeline")
    public ResponseEntity<String> addTimeline(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userid");
            //JSONObject timelineJson = new JSONObject((Map) );
            Document document = Document.parse((String) request.get("timeline"));
            document.put("_id", userId);
            mongoTemplate.save(document, "timeline");
            return ResponseEntity.status(HttpStatus.CREATED).body("Timeline added successfully!");
        } catch (JSONException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid JSON format!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add timeline!");
        }
    }
}
