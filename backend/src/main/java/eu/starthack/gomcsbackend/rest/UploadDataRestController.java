package eu.starthack.gomcsbackend.rest;

import eu.starthack.gomcsbackend.domain.Timeline;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UploadDataRestController {

    //Create me a post endpoi3
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++nt where i can upload zip files of arbitrary size and unpack them to a folder
    @PostMapping("/upload")
    public void uploadData(@RequestBody Timeline timeline) {
        System.out.println(timeline);
    }

    @GetMapping("/hello")
    public String get() {
        return "Hello";
    }
}
