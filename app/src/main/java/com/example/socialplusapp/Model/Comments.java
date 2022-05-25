package com.example.socialplusapp.Model;

import java.util.Date;

public class Comments extends CommentsId {

    private String Uid, comment, commentId, postId;
    private Date time_posted;

    public String getPostId() {
        return postId;
    }

    public String getCommentId() {
        return commentId;
    }

    public String getUid() {
        return Uid;
    }

    public String getComment() {
        return comment;
    }

    public Date getTime_posted() {
        return time_posted;
    }
}

