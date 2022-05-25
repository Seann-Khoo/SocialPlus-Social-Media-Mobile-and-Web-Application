package com.example.socialplusapp.Model;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.Exclude;

public class CommentsId {
    @Exclude
    public String CommentsId;
    public <T extends CommentsId> T withId (@NonNull final String cid){
        this.CommentsId = cid;
        return (T) this;
    }
}
