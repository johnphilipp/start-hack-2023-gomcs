package eu.starthack.gomcsbackend.domain;

import java.util.ArrayList;
import java.util.List;

public class Timeline {
    private String userId;
    private List<ActivitySegment> timelineObjects = new ArrayList<>();

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<ActivitySegment> getTimelineObjects() {
        return timelineObjects;
    }

    // add activity segment to timeline
    public void addActivitySegment(ActivitySegment activitySegment) {
        timelineObjects.add(activitySegment);
    }

    // constructor with only userId
    public Timeline(String userId) {
        this.userId = userId;
        
    }



}
