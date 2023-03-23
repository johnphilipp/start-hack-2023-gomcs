package eu.starthack.gomcsbackend.domain;

public class ActivitySegment {
    private String activityType;
    private int distance;
    private String confidence;
    private String startTime;
    private String endTime;

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }

    public String getConfidence() {
        return confidence;
    }

    public void setConfidence(String confidence) {
        this.confidence = confidence;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    // constructor with all fields
    public ActivitySegment(String activityType, int distance, String confidence, String startTime, String endTime) {
        this.activityType = activityType;
        this.distance = distance;
        this.confidence = confidence;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
