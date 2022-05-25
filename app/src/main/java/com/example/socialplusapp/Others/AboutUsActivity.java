package com.example.socialplusapp.Others;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.example.socialplusapp.R;

public class AboutUsActivity extends AppCompatActivity {

    private TextView feedbackTV;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about_us);

        feedbackTV = findViewById(R.id.feedbackTV);

        feedbackTV.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(AboutUsActivity.this, FeedbackActivity.class));
            }
        });
    }
}