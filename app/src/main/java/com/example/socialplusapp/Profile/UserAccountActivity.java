package com.example.socialplusapp.Profile;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.format.DateFormat;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.example.socialplusapp.Authentication.AccountDeletionActivity;
import com.example.socialplusapp.Authentication.ChangePasswordActivity;
import com.example.socialplusapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.Date;

public class UserAccountActivity extends AppCompatActivity {

    private Button changePasswordRedirectBtn;
    private TextView email, deleteAccountRedirectBtn, dateJoined;
    private FirebaseFirestore fireStore;
    private FirebaseAuth auth;
    private String Uid;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_account);

        changePasswordRedirectBtn = findViewById(R.id.changePasswordRedirectBtn);
        deleteAccountRedirectBtn = findViewById(R.id.deleteAccountRedirectBtn);
        email = findViewById(R.id.emailTV);
        dateJoined = findViewById(R.id.dateJoined);
        auth = FirebaseAuth.getInstance();
        Uid = auth.getCurrentUser().getUid();
        fireStore = FirebaseFirestore.getInstance();
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();

        fireStore.collection("Users").document(Uid).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()){
                    if (task.getResult().exists()){
                        String emailAddress = task.getResult().getString("email");
                        email.setText(emailAddress);
                        Date date = task.getResult().getDate("date_joined");
                        long milliseconds = date.getTime();
                        String date_joined = DateFormat.format("dd MMM yyyy" , new Date(milliseconds)).toString();
                        dateJoined.setText("Date Joined: " + date_joined);
                    }
                }
            }
        });

        changePasswordRedirectBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(UserAccountActivity.this, ChangePasswordActivity.class));
            }
        });

        deleteAccountRedirectBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(UserAccountActivity.this, AccountDeletionActivity.class));
            }
        });

    }
}