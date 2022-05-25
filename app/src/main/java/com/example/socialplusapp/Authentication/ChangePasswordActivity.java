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
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.EmailAuthProvider;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class ChangePasswordActivity extends AppCompatActivity {

    private EditText currentPasswordET, changePasswordET, confirmPasswordET;
    private Button updateBtn;
    private FirebaseAuth auth;
    private FirebaseUser user;
    private String Uid;
    private String emailAddress;
    private Date dateJoined;
    private FirebaseFirestore fireStore;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_password);

        user = FirebaseAuth.getInstance().getCurrentUser();
        auth = FirebaseAuth.getInstance();
        Uid = auth.getCurrentUser().getUid();
        fireStore = FirebaseFirestore.getInstance();
        currentPasswordET = findViewById(R.id.currentPasswordET);
        changePasswordET = findViewById(R.id.changePasswordET);
        confirmPasswordET = findViewById(R.id.confirmPasswordET);
        updateBtn = findViewById(R.id.updateBtn);

        fireStore.collection("Users").document(Uid).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()){
                    if (task.getResult().exists()){
                        String email = task.getResult().getString("email");
                        emailAddress = email;
                        Date date = task.getResult().getDate("date_joined");
                        dateJoined = date;
                    }
                }
            }
        });

        updateBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String currentPassword = currentPasswordET.getText().toString();
                String newPassword = changePasswordET.getText().toString();
                String confirmPassword = confirmPasswordET.getText().toString();
                AuthCredential credential = EmailAuthProvider.getCredential(emailAddress, currentPassword);

                if(currentPassword.isEmpty() || currentPassword.equals(" ")){
                    Toast.makeText(ChangePasswordActivity.this, "Please Enter Current Password", Toast.LENGTH_SHORT).show();;
                    return;
                }
                if(newPassword.matches(currentPassword)){
                    Toast.makeText(ChangePasswordActivity.this, "New Password Matches Current Password", Toast.LENGTH_SHORT).show();
                    return;
                }
                if(newPassword.isEmpty() || newPassword.equals(" ")){
                    Toast.makeText(ChangePasswordActivity.this, "Please Enter New Password", Toast.LENGTH_SHORT).show();
                    return;
                }
                if(!(newPassword.length() >= 6)){
                    Toast toast = Toast.makeText(ChangePasswordActivity.this,"New Password Should Contain\nAt Least 6 Characters",Toast.LENGTH_SHORT);
                    TextView tv = (TextView) toast.getView().findViewById(android.R.id.message);
                    if(tv != null){
                        tv.setGravity(Gravity.CENTER);
                    }
                    toast.show();
                    return;
                }
                if(!confirmPassword.matches(newPassword)){
                    Toast toast = Toast.makeText(ChangePasswordActivity.this,"New Password Does Not\nMatch Confirmed Password",Toast.LENGTH_SHORT);
                    TextView tv = (TextView) toast.getView().findViewById(android.R.id.message);
                    if(tv != null){
                        tv.setGravity(Gravity.CENTER);
                    }
                    toast.show();
                    return;
                }
                if(confirmPassword.isEmpty() || confirmPassword.equals(" ")){
                    Toast.makeText(ChangePasswordActivity.this, "Please Confirm New Password", Toast.LENGTH_SHORT).show();
                    return;
                }
                else{
                    user.reauthenticate(credential).addOnCompleteListener(new OnCompleteListener<Void>() {
                        @Override
                        public void onComplete(@NonNull Task<Void> task) {
                            if(task.isSuccessful()){
                                user.updatePassword(newPassword).addOnCompleteListener(new OnCompleteListener<Void>() {
                                    @Override
                                    public void onComplete(@NonNull Task<Void> task) {
                                        if(task.isSuccessful()){
                                            Toast.makeText(ChangePasswordActivity.this,"Password Updated",Toast.LENGTH_SHORT).show();
                                            //updateUser(user, emailAddress, newPassword);
                                            Map<String, Object> map = new HashMap<>();
                                            map.put("Uid", user.getUid());
                                            map.put("email", emailAddress);
                                            map.put("password", newPassword);
                                            map.put("date_joined", dateJoined);
                                            fireStore.getInstance().collection("Users").document(user.getUid())
                                                    .update(map)
                                                    .addOnCompleteListener(new OnCompleteListener<Void>() {
                                                        @Override
                                                        public void onComplete(@NonNull Task<Void> task) {
                                                            if(task.isSuccessful()){
                                                                startActivity(new Intent(ChangePasswordActivity.this, MainActivity.class));
                                                            }
                                                            else{
                                                                Toast.makeText(ChangePasswordActivity.this,task.getException().getMessage(),Toast.LENGTH_SHORT).show();
                                                            }
                                                        }
                                                    });
                                        }
                                    }
                                });
                            }
                            else{
                                Toast.makeText(ChangePasswordActivity.this,task.getException().getMessage(),Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
                }
            }
        });
    }
}