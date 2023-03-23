package eu.starthack.gomcsbackend.rest;


import org.bson.Document;
import org.bson.json.JsonObject;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RestController;

import eu.starthack.gomcsbackend.domain.ActivitySegment;
import eu.starthack.gomcsbackend.domain.Timeline;

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
        System.out.println("Request");
        try {
            String userId = (String) request.get("userId");
            //JSONObject timelineJson = new JSONObject((Map) );
            Document document = Document.parse((String) request.get("timeline"));

            // create timeline object with user id and timeline
            Timeline timeline = new Timeline(userId);
            // loop through timeline objects, identify activitySegment and add to timeline
            JSONObject timelineJson = new JSONObject(document.toJson());
            JSONArray timelineObjectsJsonArray = timelineJson.getJSONArray("timelineObjects");
            // loop through each object in timeline
            for (int i = 0; i < timelineObjectsJsonArray.length(); i++) {
                JSONObject timelineObject = timelineObjectsJsonArray.getJSONObject(i);
                // check if current object is an activitySegment
                if (!timelineObject.isNull("activitySegment")) {
                    // get activitySegment object
                    JSONObject activitySegment = timelineObject.getJSONObject("activitySegment");
                    // get activity type
                    String activityType = activitySegment.getString("activityType");
                    // get distance
                    int distance = activitySegment.getInt("distance");
                    // get confidence
                    String confidence = activitySegment.getString("confidence");
                    // get start time
                    JSONObject duration = activitySegment.getJSONObject("duration");
                    String startTime = duration.getString("startTimestamp");
                    // get end time
                    String endTime = duration.getString("endTimestamp");
                    // create activitySegment object
                    ActivitySegment activitySegmentObject = new ActivitySegment(activityType, distance, confidence, startTime, endTime);
                    // log activity segment
                    System.out.println("Activity segment " + activitySegmentObject.getActivityType() + " " + activitySegmentObject.getDistance() + " " + activitySegmentObject.getConfidence() + " " + activitySegmentObject.getStartTime() + " " + activitySegmentObject.getEndTime());
                    // add activity segment to timeline
                    timeline.addActivitySegment(activitySegmentObject);

                    mongoTemplate.save(activitySegmentObject, userId);
                }
            }

            return ResponseEntity.status(HttpStatus.CREATED).body("Timeline added successfully!");
        } catch (JSONException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid JSON format!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add timeline!");
        }
    }
}
