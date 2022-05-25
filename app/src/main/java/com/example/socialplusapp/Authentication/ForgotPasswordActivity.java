package com.example.socialplusapp.Authentication;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.socialplusapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;

public class ForgotPasswordActivity extends AppCompatActivity {

    private EditText forgotPasswordET;
    private Button sendBtn;
    private FirebaseAuth auth;
    public static final String EMAIL_REGEX = "^(.+)@student.tp.edu.sg$";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgot_password);

        forgotPasswordET = findViewById(R.id.forgotPasswordET);
        sendBtn = findViewById(R.id.sendBtn);
        auth = FirebaseAuth.getInstance();

        sendBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = forgotPasswordET.getText().toString();

                if(!email.matches(EMAIL_REGEX) || email.isEmpty()){
                    Toast.makeText(ForgotPasswordActivity.this,"Please Enter Valid Student Email",Toast.LENGTH_SHORT).show();
                    return;
                }
                else{
                    auth.sendPasswordResetEmail(email).addOnCompleteListener(new OnCompleteListener<Void>() {
                        @Override
                        public void onComplete(@NonNull Task<Void> task) {
                            if(task.isSuccessful()){
                                Toast toast = Toast.makeText(ForgotPasswordActivity.this,"Password Recovery Email Sent.\nPlease Check Student Email Inbox",Toast.LENGTH_SHORT);
                                TextView tv = (TextView) toast.getView().findViewById(android.R.id.message);
                                if(tv != null){
                                    tv.setGravity(Gravity.CENTER);
                                }
                                toast.show();
                                startActivity(new Intent(ForgotPasswordActivity.this, LoginActivity.class));
                                finish();
                            }
                            else{
                                Toast.makeText(ForgotPasswordActivity.this,task.getException().getMessage(),Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
                }
            }
        });

    }
}