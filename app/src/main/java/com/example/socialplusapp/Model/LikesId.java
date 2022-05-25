package com.example.socialplusapp.Model;

import androidx.annotation.NonNull;

import com.google.firebase.firestore.Exclude;

public class LikesId {
    @Exclude
    public String LikesId;
    public <T extends LikesId> T withId (@NonNull final String lid){
        this.LikesId = lid;
        return (T) this;
    }
}
