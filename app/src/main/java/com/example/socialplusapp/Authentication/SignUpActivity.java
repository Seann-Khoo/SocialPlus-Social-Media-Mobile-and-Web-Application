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
import com.example.socialplusapp.Profile.SetUpActivity;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class SignUpActivity extends AppCompatActivity {

    private EditText emailSignUp, passwordSignUp;
    private Button signUpButton;
    private TextView loginText;
    private FirebaseAuth auth;
    private FirebaseFirestore fireStore;

    public static final String EMAIL_REGEX = "^(.+)@student.tp.edu.sg$";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);

        auth = FirebaseAuth.getInstance();

        emailSignUp = findViewById(R.id.emailET);
        passwordSignUp = findViewById(R.id.passwordET);
        loginText = findViewById(R.id.loginTV);
        signUpButton = findViewById(R.id.signUpBtn);

        loginText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(SignUpActivity.this, LoginActivity.class));
                finish();
            }
        });

        signUpButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = emailSignUp.getText().toString();
                String password = passwordSignUp.getText().toString();

                if(email.isEmpty() || !email.matches(EMAIL_REGEX)){
                    Toast.makeText(SignUpActivity.this, "Please Enter Valid Student Email", Toast.LENGTH_SHORT).show();
                    return;
                }
                if(password.isEmpty() || !(password.length() >= 6)){
                    Toast toast = Toast.makeText(SignUpActivity.this,"Password Should Contain\nAt Least 6 Characters",Toast.LENGTH_SHORT);
                    TextView tv = (TextView) toast.getView().findViewById(android.R.id.message);
                    if(tv != null){
                        tv.setGravity(Gravity.CENTER);
                    }
                    toast.show();
                    return;
                }
                else{
                    auth.createUserWithEmailAndPassword(email,password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task) {
                            if(task.isSuccessful()){
                                FirebaseUser user = auth.getCurrentUser();
                                Toast toast = Toast.makeText(SignUpActivity.this,"Registration Successful!\nStart Posting on Social+!",Toast.LENGTH_SHORT);
                                TextView tv = (TextView) toast.getView().findViewById(android.R.id.message);
                                if(tv != null){
                                    tv.setGravity(Gravity.CENTER);
                                }
                                toast.show();
                                Map<String, Object> map = new HashMap<>();
                                map.put("Uid", user.getUid());
                                map.put("email", email);
                                map.put("password", password);
                                map.put("date_joined", FieldValue.serverTimestamp());
                                fireStore.getInstance().collection("Users").document(user.getUid())
                                        .set(map)
                                        .addOnCompleteListener(new OnCompleteListener<Void>() {
                                            @Override
                                            public void onComplete(@NonNull Task<Void> task) {
                                                if(task.isSuccessful()){
                                                    startActivity(new Intent(SignUpActivity.this, SetUpActivity.class));
                                                }
                                                else{
                                                    Toast.makeText(SignUpActivity.this,task.getException().getMessage(),Toast.LENGTH_SHORT).show();
                                                }
                                            }
                                        });
                                //uploadUser(user,email,password);
                                finish();
                            }
                            else{
                                Toast.makeText(SignUpActivity.this,task.getException().getMessage(),Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
                }
            }
        });
    }
}