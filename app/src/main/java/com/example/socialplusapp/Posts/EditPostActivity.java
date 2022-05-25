package com.example.socialplusapp.Posts;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.example.socialplusapp.Categories.MainActivity;
import com.example.socialplusapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class EditPostActivity extends AppCompatActivity {

    private Button postBtn;
    private EditText captionET;
    private ImageView postImage;
    private ProgressBar progressBar;
    private Toolbar addPostToolbar;
    private TextView selectedCategory, editPostText;
    private Uri PostImageUri = null;
    private StorageReference storageReference;
    private FirebaseFirestore fireStore;
    private FirebaseAuth auth;
    private String currentUserId;
    private String postId, profileName;
    private Date datePosted;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_post);

        postBtn = findViewById(R.id.editPostBtn);
        captionET = findViewById(R.id.ep_captionET);
        postImage = findViewById(R.id.ep_post_image);
        progressBar = findViewById(R.id.progressBar4);
        progressBar.setVisibility(View.INVISIBLE);
        addPostToolbar = findViewById(R.id.edit_post_toolbar);
        addPostToolbar.setLogo(R.drawable.logo_white);
        selectedCategory = findViewById(R.id.category);
        editPostText = findViewById(R.id.edit_post_text);

        storageReference = FirebaseStorage.getInstance().getReference();
        fireStore = FirebaseFirestore.getInstance();
        auth = FirebaseAuth.getInstance();
        currentUserId = auth.getCurrentUser().getUid();
        postId = getIntent().getStringExtra("PostID");

        fireStore.collection("User Posts").document(postId).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()){
                    if (task.getResult().exists()){
                        String post_caption = task.getResult().getString("post_caption");
                        String post_image = task.getResult().getString("post_image");
                        String category = task.getResult().getString("category");
                        Date date = task.getResult().getDate("time_posted");

                        datePosted = date;
                        PostImageUri = Uri.parse(post_image);
                        captionET.setText(post_caption);
                        selectedCategory.setText(category);
                        RequestOptions requestOptions = new RequestOptions();
                        requestOptions.placeholder(R.drawable.choose_profile_image);
                        Glide.with(EditPostActivity.this).load(post_image).into(postImage);
                    }
                }
            }
        });

        fireStore.collection("User Profile").document(currentUserId).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()){
                    if (task.getResult().exists()){
                        String name = task.getResult().getString("profile_name");
                        profileName = name;
                    }
                }
            }
        });

        postBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String caption = captionET.getText().toString();
                String selected_category = selectedCategory.getText().toString();

                if (caption.isEmpty() || caption.equals(" ")) {
                    Toast.makeText(EditPostActivity.this, "Please Insert Post Caption", Toast.LENGTH_SHORT).show();
                }
                else {
                    editPostText.setVisibility(View.INVISIBLE);
                    progressBar.setVisibility(View.VISIBLE);
                    Map<String, Object> dataMap = new HashMap<>();
                    dataMap.put("Uid", currentUserId);
                    dataMap.put("user", profileName);
                    dataMap.put("post_image", PostImageUri.toString());
                    dataMap.put("post_caption", caption);
                    dataMap.put("time_posted", datePosted);
                    dataMap.put("category", selected_category);
                    fireStore.collection("User Posts").document(postId).set(dataMap).addOnCompleteListener(new OnCompleteListener<Void>() {
                        @Override
                        public void onComplete(@NonNull Task<Void> task) {
                            if (task.isSuccessful()) {
                                progressBar.setVisibility(View.VISIBLE);
                                Toast.makeText(EditPostActivity.this, "Post Updated", Toast.LENGTH_SHORT).show();
                                startActivity(new Intent(EditPostActivity.this, MainActivity.class));
                                finish();
                            } else {
                                progressBar.setVisibility(View.INVISIBLE);
                                editPostText.setVisibility(View.VISIBLE);
                                Toast.makeText(EditPostActivity.this, task.getException().toString(), Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
                }
            }
        });
    }
}