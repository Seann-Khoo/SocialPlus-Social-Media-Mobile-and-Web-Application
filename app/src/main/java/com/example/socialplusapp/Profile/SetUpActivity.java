package com.example.socialplusapp.Profile;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.example.socialplusapp.R;
import com.example.socialplusapp.Others.WelcomeActivity;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.UploadTask;
import com.theartofdev.edmodo.cropper.CropImage;
import com.theartofdev.edmodo.cropper.CropImageView;

import java.util.HashMap;

import de.hdodenhof.circleimageview.CircleImageView;

public class SetUpActivity extends AppCompatActivity {

    private CircleImageView circleImageView;
    private EditText profileName;
    private Button saveBtn;
    private ProgressBar progressBar;
    private Uri ImageUri;
    private boolean isChanged = false;
    private String Uid;
    private FirebaseAuth auth;
    private FirebaseFirestore fireStore;
    private StorageReference storageReference;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_set_up);

        storageReference = FirebaseStorage.getInstance().getReference();
        fireStore = FirebaseFirestore.getInstance();

        circleImageView = findViewById(R.id.profileImage);
        profileName = findViewById(R.id.profileNameET);
        saveBtn = findViewById(R.id.saveBtn);
        progressBar = findViewById(R.id.progressBar);
        progressBar.setVisibility(View.INVISIBLE);

        auth = FirebaseAuth.getInstance();
        Uid = auth.getCurrentUser().getUid();

        fireStore.collection("User Profile").document(Uid).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()){
                    if (task.getResult().exists()){
                        String name = task.getResult().getString("profile_name");
                        String profile = task.getResult().getString("profile_image");

                        ImageUri = Uri.parse(profile);
                        profileName.setText(name);
                        RequestOptions requestOptions = new RequestOptions();
                        requestOptions.placeholder(R.drawable.choose_profile_image);
                        Glide.with(SetUpActivity.this).load(profile).into(circleImageView);
                    }
                }
            }
        });

        circleImageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
                    if (ContextCompat.checkSelfPermission(SetUpActivity.this , Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED){

                        ActivityCompat.requestPermissions(SetUpActivity.this , new String[] {Manifest.permission.READ_EXTERNAL_STORAGE} , 1);
                    }
                    else{
                        CropImage.activity()
                                .setGuidelines(CropImageView.Guidelines.ON)
                                .setAspectRatio(1,1)
                                .start(SetUpActivity.this);

                    }
                }
            }
        });

        saveBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String name = profileName.getText().toString().toLowerCase();
                if (name.isEmpty() || name.equals(" ")){
                    Toast.makeText(SetUpActivity.this, "Please Insert Profile Name",Toast.LENGTH_SHORT).show();
                }
                if (ImageUri == null){
                    Toast.makeText(SetUpActivity.this,"Please Select Profile Image",Toast.LENGTH_SHORT).show();
                }
                if (name.isEmpty() && ImageUri == null){
                    Toast.makeText(SetUpActivity.this, "Please Select Profile Image and Insert Profile Name", Toast.LENGTH_SHORT).show();
                }
                if(!name.isEmpty() && ImageUri != null){
                    StorageReference imageRef = storageReference.child("Profile_Images").child(Uid + ".jpg");
                    if (isChanged){
                        progressBar.setVisibility(View.VISIBLE);
                        imageRef.putFile(ImageUri).addOnCompleteListener(new OnCompleteListener<UploadTask.TaskSnapshot>() {
                            @Override
                            public void onComplete(@NonNull Task<UploadTask.TaskSnapshot> task) {
                                if (task.isSuccessful()){
                                    imageRef.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                                        @Override
                                        public void onSuccess(Uri uri){
                                            saveToFireStore(task,name,uri);
                                        }
                                    });
                                }else{
                                    Toast.makeText(SetUpActivity.this, task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                                }
                                progressBar.setVisibility(View.INVISIBLE);
                            }
                        });
                    }
                    else{
                        saveToFireStore(null , name , ImageUri);
                        progressBar.setVisibility(View.INVISIBLE);
                    }
                }
            }
        });
    }

    private void saveToFireStore(Task<UploadTask.TaskSnapshot> task, String name, Uri downloadUri) {
        HashMap<String , Object> map = new HashMap<>();
        map.put("Uid", Uid);
        map.put("profile_name" , name);
        map.put("profile_image" , downloadUri.toString());
        fireStore.collection("User Profile").document(Uid).set(map).addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                if (task.isSuccessful()){
                    progressBar.setVisibility(View.INVISIBLE);
                    Toast.makeText(SetUpActivity.this, "Profile Information Updated", Toast.LENGTH_SHORT).show();
                    startActivity(new Intent(SetUpActivity.this , WelcomeActivity.class));
                    finish();
                }else{
                    progressBar.setVisibility(View.INVISIBLE);
                    Toast.makeText(SetUpActivity.this, task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == CropImage.CROP_IMAGE_ACTIVITY_REQUEST_CODE){
            CropImage.ActivityResult result = CropImage.getActivityResult(data);
            if (resultCode == RESULT_OK) {
                ImageUri = result.getUri();
                circleImageView.setImageURI(ImageUri);
                isChanged = true;
            } else if (resultCode == CropImage.CROP_IMAGE_ACTIVITY_RESULT_ERROR_CODE) {
                Exception error = result.getError();
                Toast.makeText(this, error.getMessage() , Toast.LENGTH_SHORT).show();
            }
        }
    }
}
