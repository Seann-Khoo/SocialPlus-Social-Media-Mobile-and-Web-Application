package com.example.socialplusapp.Authentication;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.socialplusapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.EmailAuthProvider;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

public class AccountDeletionActivity extends AppCompatActivity {

    private EditText email, password;
    private TextView deleteAccountBtn;
    private String Uid;
    private FirebaseAuth auth;
    private FirebaseUser currentUser;
    private FirebaseFirestore fireStore;

    public static final String EMAIL_REGEX = "^(.+)@student.tp.edu.sg$";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_account_deletion);

        email = findViewById(R.id.da_emailET);
        password = findViewById(R.id.da_passwordET);
        deleteAccountBtn = findViewById(R.id.deleteAccountBtn);
        auth = FirebaseAuth.getInstance();
        Uid = auth.getCurrentUser().getUid();
        currentUser = FirebaseAuth.getInstance().getCurrentUser();
        fireStore = FirebaseFirestore.getInstance();

        deleteAccountBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String emailAddress = email.getText().toString();
                String user_password = password.getText().toString();

                if(!emailAddress.matches(EMAIL_REGEX)) {
                    Toast.makeText(AccountDeletionActivity.this, "Invalid Student Email Entered", Toast.LENGTH_SHORT).show();
                    return;
                }
                if(emailAddress.equals(" ") || emailAddress.isEmpty()){
                    Toast.makeText(AccountDeletionActivity.this, "Please Enter Student Email", Toast.LENGTH_SHORT).show();
                    return;
                }
                if(user_password.isEmpty() || user_password.equals(" ")) {
                    Toast.makeText(AccountDeletionActivity.this, "Please Enter Current Password", Toast.LENGTH_SHORT).show();
                    return;
                }
                if(!(user_password.length() >= 6)){
                    Toast toast = Toast.makeText(AccountDeletionActivity.this,"Password Should Contain\nAt Least 6 Characters",Toast.LENGTH_SHORT);
                    TextView tv = (TextView) toast.getView().findViewById(android.R.id.message);
                    if(tv != null){
                        tv.setGravity(Gravity.CENTER);
                    }
                    toast.show();
                    return;
                }
                else {
                    AlertDialog.Builder alert = new AlertDialog.Builder(AccountDeletionActivity.this);
                    alert.setTitle("Deactivate User Account").setMessage("Are you sure you want to deactivate your User Account? User Account and its relevant information cannot be retrieved once deactivated").setNegativeButton("No", null).setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            fireStore.collectionGroup("Comments").whereEqualTo("Uid", Uid).get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                @Override
                                public void onComplete(@NonNull Task<QuerySnapshot> task) {
                                    for(QueryDocumentSnapshot snapshot : task.getResult()){
                                        String postId = snapshot.getString("postId");
                                        String commentId = snapshot.getString("commentId");
                                        fireStore.collection("User Posts/" + postId + "/Comments").document(commentId).delete().addOnCompleteListener(new OnCompleteListener<Void>() {
                                            @Override
                                            public void onComplete(@NonNull Task<Void> task) {

                                            }
                                        });
                                    }
                                }
                            });
                            fireStore.collectionGroup("Likes").whereEqualTo("Uid", Uid).get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                @Override
                                public void onComplete(@NonNull Task<QuerySnapshot> task) {
                                    for(QueryDocumentSnapshot snapshot : task.getResult()){
                                        String postId = snapshot.getString("postId");
                                        fireStore.collection("User Posts/" + postId + "/Likes").document(Uid).delete().addOnCompleteListener(new OnCompleteListener<Void>() {
                                            @Override
                                            public void onComplete(@NonNull Task<Void> task) {

                                            }
                                        });
                                    }
                                }
                            });
                            fireStore.collection("User Posts").whereEqualTo("Uid", Uid).get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                @Override
                                public void onComplete(@NonNull Task<QuerySnapshot> task) {
                                    for(QueryDocumentSnapshot snapshot : task.getResult()){
                                        fireStore.collection("User Posts").document(snapshot.getId()).delete();
                                    }
                                }
                            });
                            fireStore.collection("User Profile").document(Uid).delete();
                            fireStore.collection("Users").document(Uid).delete();
                            AuthCredential credential = EmailAuthProvider.getCredential(emailAddress, user_password);
                            currentUser.reauthenticate(credential).addOnCompleteListener(new OnCompleteListener<Void>() {
                                @Override
                                public void onComplete(@NonNull Task<Void> task) {
                                    if(task.isSuccessful()){
                                        currentUser.delete().addOnCompleteListener(new OnCompleteListener<Void>() {
                                            @Override
                                            public void onComplete(@NonNull Task<Void> task) {
                                                if(task.isSuccessful()){
                                                    Toast.makeText(AccountDeletionActivity.this, "User Account Deactivated", Toast.LENGTH_SHORT).show();
                                                    startActivity(new Intent(AccountDeletionActivity.this, LoginActivity.class));
                                                }
                                                else{
                                                    Toast.makeText(AccountDeletionActivity.this, task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                    alert.show();
                }
            }
        });
    }
}