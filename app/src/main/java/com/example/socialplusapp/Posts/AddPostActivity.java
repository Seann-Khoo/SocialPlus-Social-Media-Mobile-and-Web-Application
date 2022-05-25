package com.example.socialplusapp.Posts;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.example.socialplusapp.Categories.MainActivity;
import com.example.socialplusapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;
import com.theartofdev.edmodo.cropper.CropImage;
import com.theartofdev.edmodo.cropper.CropImageView;

import java.util.HashMap;
import java.util.Map;

public class AddPostActivity extends AppCompatActivity {

    private Button postBtn;
    private EditText captionET;
    private ImageView postImage;
    private ProgressBar progressBar;
    private Toolbar addPostToolbar;
    private Spinner spinner;
    private TextView addPostText;
    private Uri PostImageUri = null;
    private StorageReference storageReference;
    private FirebaseFirestore fireStore;
    private FirebaseAuth auth;
    private String currentUserId;
    private String selectedCategory, profileName;
    private String[] categories = { "Select Post Category", "Sports & Outdoors", "Arts & Music", "Games", "Tech", "Pets", "Others" };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_post);

        postBtn = findViewById(R.id.postBtn);
        captionET = findViewById(R.id.captionET);
        postImage = findViewById(R.id.post_image);
        addPostText = findViewById(R.id.add_post_text);
        progressBar = findViewById(R.id.progressBar2);
        progressBar.setVisibility(View.INVISIBLE);
        addPostToolbar = findViewById(R.id.add_post_toolbar);
        addPostToolbar.setLogo(R.drawable.logo_white);
        spinner = findViewById(R.id.spinner);

        storageReference = FirebaseStorage.getInstance().getReference();
        fireStore = FirebaseFirestore.getInstance();
        auth = FirebaseAuth.getInstance();
        currentUserId = auth.getCurrentUser().getUid();

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

        spinner = (Spinner) findViewById(R.id.spinner);
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

        postImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                CropImage.activity()
                        .setGuidelines(CropImageView.Guidelines.ON)
                        .setAspectRatio(3,2)
                        .setMinCropResultSize(512,512)
                        .start(AddPostActivity.this);
            }
        });

        postBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String caption = captionET.getText().toString();

                if (caption.isEmpty() || caption.equals(" ")){
                    Toast.makeText(AddPostActivity.this,"Please Insert Post Caption",Toast.LENGTH_SHORT).show();
                }
                if (PostImageUri == null){
                    Toast.makeText(AddPostActivity.this,"Please Select Post Image",Toast.LENGTH_SHORT).show();
                }
                if (selectedCategory == "Select Post Category"){
                    Toast.makeText(AddPostActivity.this, "Please Select Post Category", Toast.LENGTH_SHORT).show();
                }
                if (caption.isEmpty() && PostImageUri == null && selectedCategory == "Select Post Category"){
                    Toast toast = Toast.makeText(AddPostActivity.this, "Please Select Post Image and Post Category \n ,and Insert Post Caption", Toast.LENGTH_SHORT);
                    TextView tv = (TextView) toast.getView().findViewById(android.R.id.message);
                    if(tv != null){
                        tv.setGravity(Gravity.CENTER);
                    }
                    toast.show();
                }
                if (!caption.isEmpty() && PostImageUri != null && selectedCategory != "Select Post Category"){
                    addPostText.setVisibility(View.INVISIBLE);
                    progressBar.setVisibility(View.VISIBLE);
                    StorageReference filePath = storageReference.child("User_Post_Images").child(FieldValue.serverTimestamp().toString() + ".jpg");
                    filePath.putFile(PostImageUri).addOnCompleteListener(new OnCompleteListener<UploadTask.TaskSnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<UploadTask.TaskSnapshot> task) {
                            if (task.isSuccessful()){
                                filePath.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                                    @Override
                                    public void onSuccess(Uri uri) {
                                        Map<String , Object> dataMap = new HashMap<>();
                                        dataMap.put("Uid" , currentUserId);
                                        dataMap.put("user", profileName);
                                        dataMap.put("post_image" , uri.toString());
                                        dataMap.put("post_caption" , caption);
                                        dataMap.put("time_posted" , FieldValue.serverTimestamp());
                                        dataMap.put("category", selectedCategory);
                                        fireStore.collection("User Posts").add(dataMap).addOnCompleteListener(new OnCompleteListener<DocumentReference>() {
                                            @Override
                                            public void onComplete(@NonNull Task<DocumentReference> task) {
                                                if (task.isSuccessful()){
                                                    progressBar.setVisibility(View.VISIBLE);
                                                    Toast.makeText(AddPostActivity.this, "Post Added", Toast.LENGTH_SHORT).show();
                                                    startActivity(new Intent(AddPostActivity.this , MainActivity.class));
                                                    finish();
                                                }else{
                                                    progressBar.setVisibility(View.INVISIBLE);
                                                    addPostText.setVisibility(View.VISIBLE);
                                                    Toast.makeText(AddPostActivity.this, task.getException().toString(), Toast.LENGTH_SHORT).show();
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                            else{
                                progressBar.setVisibility(View.INVISIBLE);
                                addPostText.setVisibility(View.VISIBLE);
                                Toast.makeText(AddPostActivity.this, task.getException().toString() , Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
                }
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == CropImage.CROP_IMAGE_ACTIVITY_REQUEST_CODE){
            CropImage.ActivityResult result =CropImage.getActivityResult(data);
            if (resultCode == RESULT_OK){
                PostImageUri = result.getUri();
                postImage.setImageURI(PostImageUri);
            }
            else if (resultCode == CropImage.CROP_IMAGE_ACTIVITY_RESULT_ERROR_CODE){
                Toast.makeText(AddPostActivity.this,result.getError().toString(),Toast.LENGTH_SHORT).show();
            }
        }
    }
}