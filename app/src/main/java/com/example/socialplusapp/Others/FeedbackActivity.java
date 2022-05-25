package com.example.socialplusapp.Others;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.example.socialplusapp.Categories.MainActivity;
import com.example.socialplusapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class FeedbackActivity extends AppCompatActivity {

    private EditText feedbackET;
    private Button feedbackBtn;
    private Spinner spinner;
    private String selectedCategory;
    private String[] categories = {"Feedback Category", "General Feedback", "Bugs Reporting", "Features Suggestion"};
    private FirebaseFirestore fireStore;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_feedback);

        feedbackET = findViewById(R.id.feedbackET);
        feedbackBtn = findViewById(R.id.feedbackBtn);
        spinner = findViewById(R.id.feedback_spinner);
        fireStore = FirebaseFirestore.getInstance();

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, R.layout.spinner_item, categories);
        adapter.setDropDownViewResource(R.layout.spinner_item_dropdown);
        spinner.setAdapter(adapter);
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selected = parent.getItemAtPosition(position).toString();
                selectedCategory = selected;
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        feedbackBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String feedback = feedbackET.getText().toString();

                if(feedback.isEmpty() || feedback.equals(" ")){
                    Toast.makeText(FeedbackActivity.this, "Please Insert Feedback", Toast.LENGTH_SHORT).show();
                }
                if(selectedCategory == "Feedback Category"){
                    Toast.makeText(FeedbackActivity.this, "Please Select Feedback Category", Toast.LENGTH_SHORT).show();
                }
                else{
                    Map<String , Object> feedbackMap = new HashMap<>();
                    feedbackMap.put("feedback", feedback);
                    feedbackMap.put("category", selectedCategory);
                    feedbackMap.put("time_posted", FieldValue.serverTimestamp());
                    fireStore.collection("User Feedback").add(feedbackMap).addOnCompleteListener(new OnCompleteListener<DocumentReference>() {
                        @Override
                        public void onComplete(@NonNull Task<DocumentReference> task) {
                            if(task.isSuccessful()){
                                Toast toast = Toast.makeText(FeedbackActivity.this,"Feedback Sent.\nThank You!",Toast.LENGTH_SHORT);
                                TextView tv = (TextView) toast.getView().findViewById(android.R.id.message);
                                if(tv != null){
                                    tv.setGravity(Gravity.CENTER);
                                }
                                toast.show();
                                startActivity(new Intent(FeedbackActivity.this, MainActivity.class));
                                finish();
                            }
                            else{
                                Toast.makeText(FeedbackActivity.this,task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
                }
            }
        });
    }
}