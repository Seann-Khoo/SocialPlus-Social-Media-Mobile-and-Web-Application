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

import com.example.socialplusapp.Categories.MainActivity;
import com.example.socialplusapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;

public class LoginActivity extends AppCompatActivity {

    private EditText loginEmail, loginPassword;
    private Button loginButton;
    private TextView signUpText, forgotPasswordText;
    private FirebaseAuth mAuth;

    public static final String EMAIL_REGEX = "^(.+)@student.tp.edu.sg$";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        mAuth = FirebaseAuth.getInstance();

        loginEmail = findViewById(R.id.emailET);
        loginPassword = findViewById(R.id.passwordET);
        loginButton = findViewById(R.id.loginBtn);
        signUpText = findViewById(R.id.signUpTV);
        forgotPasswordText = findViewById(R.id.forgotPasswordTV);

        signUpText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(LoginActivity.this, SignUpActivity.class));
            }
        });
        forgotPasswordText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(LoginActivity.this, ForgotPasswordActivity.class));
            }
        });
        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = loginEmail.getText().toString();
                String password = loginPassword.getText().toString();

                if(email.isEmpty() || !email.matches(EMAIL_REGEX)) {
                    Toast.makeText(LoginActivity.this, "Invalid Student Email Entered", Toast.LENGTH_SHORT).show();
                    return;
                }
                if(password.isEmpty() || password.length()<6) {
                    Toast.makeText(LoginActivity.this, "Invalid Password Entered", Toast.LENGTH_SHORT).show();
                    return;
                }
                else{
                    mAuth.signInWithEmailAndPassword(email,password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task) {
                            if(task.isSuccessful()){
                                Toast toast = Toast.makeText(LoginActivity.this,"Login Successful!\nWelcome Back to Social+!",Toast.LENGTH_SHORT);
                                TextView tv = (TextView) toast.getView().findViewById(android.R.id.message);
                                if(tv != null){
                                    tv.setGravity(Gravity.CENTER);
                                }
                                toast.show();
                                startActivity(new Intent (LoginActivity.this, MainActivity.class));
                                finish();
                            }
                            else{
                                Toast.makeText(LoginActivity.this,task.getException().getMessage(),Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
                }
            }
        });
    }
}