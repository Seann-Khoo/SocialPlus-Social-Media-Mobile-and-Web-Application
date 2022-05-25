package com.example.socialplusapp.Model;

import java.util.Date;

public class Post extends PostId{

    private String Uid, post_image, post_caption, category;
    private Date time_posted;

    public String getUid() {
        return Uid;
    }

    public String getPost_image() {
        return post_image;
    }

    public String getPost_caption() {
        return post_caption;
    }

    public String getCategory() {
        return category;
    }

    public Date getTime_posted() {
        return time_posted;
    }
}
