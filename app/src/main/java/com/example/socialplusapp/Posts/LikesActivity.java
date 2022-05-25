package com.example.socialplusapp.Posts;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import com.example.socialplusapp.Adapter.LikesAdapter;
import com.example.socialplusapp.Model.Likes;
import com.example.socialplusapp.Model.Users;
import com.example.socialplusapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentChange;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.List;

public class LikesActivity extends AppCompatActivity {

    private RecyclerView likes_recyclerview;
    private FirebaseFirestore fireStore;
    private String postId;
    private LikesAdapter adapter;
    private List<Likes> mList;
    private List<Users> usersList;
    private TextView likeCount;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_likes);

        likes_recyclerview = findViewById(R.id.likes_recyclerview);

        fireStore = FirebaseFirestore.getInstance();
        mList = new ArrayList<>();
        usersList = new ArrayList<>();
        adapter = new LikesAdapter(LikesActivity.this,mList,usersList);
        postId = getIntent().getStringExtra("postID");
        likeCount = findViewById(R.id.likeCountTV);

        likes_recyclerview.setHasFixedSize(true);
        likes_recyclerview.setLayoutManager(new LinearLayoutManager(this));
        likes_recyclerview.setAdapter(adapter);

        fireStore.collection("User Posts/" + postId + "/Likes").addSnapshotListener(LikesActivity.this, new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                for(DocumentChange documentChange : value.getDocumentChanges()){
                    if(documentChange.getType() ==  DocumentChange.Type.ADDED){
                        String likeId = documentChange.getDocument().getId();
                        Likes likes = documentChange.getDocument().toObject(Likes.class).withId(likeId);
                        String userId = documentChange.getDocument().getId();
                        fireStore.collection("User Profile").document(userId).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                            @Override
                            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                                if(task.isSuccessful()){
                                    Users users = task.getResult().toObject(Users.class);
                                    usersList.add(users);
                                    mList.add(likes);
                                    adapter.notifyDataSetChanged();
                                }
                                else{
                                    Toast.makeText(LikesActivity.this,task.getException().getMessage(),Toast.LENGTH_SHORT).show();
                                }
                            }
                        });
                    }
                    else{
                        adapter.notifyDataSetChanged();
                    }
                }
            }
        });

        fireStore.collection("User Posts/" + postId + "/Likes").addSnapshotListener(new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                if (error == null) {
                    if (!value.isEmpty()) {
                        int count = value.size();
                        if (count == 1){
                            likeCount.setText(count + " like");
                        }
                        else{
                            likeCount.setText(count + " likes");
                        }
                    }
                }
            }
        });
    }
}