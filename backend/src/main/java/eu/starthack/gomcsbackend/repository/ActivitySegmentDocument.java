package eu.starthack.gomcsbackend.repository;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activitySegment")
public class ActivitySegmentDocument {
    public String timelineId;

    public String activityType;
    public int distance;
    public String confidence;
    public String startTime;
    public String endTime;

    public ActivitySegmentDocument(String timelineId, String activityType, int distance, String confidence, String startTime, String endTime) {
        this.timelineId = timelineId;
        this.activityType = activityType;
        this.distance = distance;
        this.confidence = confidence;
        this.startTime = startTime;
        this.endTime = endTime;
    } 
}
