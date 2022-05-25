package com.example.socialplusapp.Posts;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.socialplusapp.Adapter.CommentsAdapter;
import com.example.socialplusapp.Model.Comments;
import com.example.socialplusapp.Model.Users;
import com.example.socialplusapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentChange;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CommentsActivity extends AppCompatActivity {

    private EditText commentET;
    private Button postCommentBtn;
    private RecyclerView comment_recyclerview;
    private FirebaseAuth auth;
    private FirebaseFirestore fireStore;
    private String currentUserId;
    private String postId;
    private CommentsAdapter adapter;
    private List<Comments> mList;
    private List<Users> usersList;
    private TextView commentCount;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_comments);

        commentET = findViewById(R.id.commentET);
        postCommentBtn = findViewById(R.id.postCommentBtn);
        comment_recyclerview = findViewById(R.id.comment_recyclerview);

        auth = FirebaseAuth.getInstance();
        currentUserId = auth.getCurrentUser().getUid();
        fireStore = FirebaseFirestore.getInstance();
        mList = new ArrayList<>();
        usersList = new ArrayList<>();
        adapter = new CommentsAdapter(CommentsActivity.this,mList,usersList);
        postId = getIntent().getStringExtra("postid");
        commentCount = findViewById(R.id.commentCountTV);

        comment_recyclerview.setHasFixedSize(true);
        comment_recyclerview.setLayoutManager(new LinearLayoutManager(this));
        comment_recyclerview.setAdapter(adapter);

        fireStore.collection("User Posts/" + postId + "/Comments").orderBy("time_posted", Query.Direction.ASCENDING).addSnapshotListener(CommentsActivity.this, new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                for(DocumentChange documentChange : value.getDocumentChanges()){
                    if(documentChange.getType() ==  DocumentChange.Type.ADDED){
                        String commentId = documentChange.getDocument().getId();
                        Comments comments = documentChange.getDocument().toObject(Comments.class).withId(commentId);
                        String userId = documentChange.getDocument().getString("Uid");
                        fireStore.collection("User Profile").document(userId).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                            @Override
                            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                                if(task.isSuccessful()){
                                    Users users = task.getResult().toObject(Users.class);
                                    usersList.add(users);
                                    mList.add(comments);
                                    adapter.notifyDataSetChanged();
                                }
                                else{
                                    Toast.makeText(CommentsActivity.this,task.getException().getMessage(),Toast.LENGTH_SHORT).show();
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

        postCommentBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String comment = commentET.getText().toString();
                if (comment.isEmpty() || comment.equals(" ")){
                    Toast.makeText(CommentsActivity.this, "Please Insert Caption", Toast.LENGTH_SHORT).show();
                }
                else{
                    DocumentReference documentReference = fireStore.collection("User Posts/" + postId + "/Comments").document();
                    Map<String , Object> commentMap = new HashMap<>();
                    commentMap.put("postId", postId);
                    commentMap.put("commentId", documentReference.getId());
                    commentMap.put("Uid", currentUserId);
                    commentMap.put("comment", comment);
                    commentMap.put("time_posted", FieldValue.serverTimestamp());
                    fireStore.collection("User Posts/" + postId + "/Comments").document(documentReference.getId()).set(commentMap).addOnCompleteListener(new OnCompleteListener<Void>() {
                        @Override
                        public void onComplete(@NonNull Task<Void> task) {
                            if(task.isSuccessful()){
                                Toast.makeText(CommentsActivity.this,"Comment Added",Toast.LENGTH_SHORT).show();
                                commentET.setText(null);
                            }
                            else{
                                Toast.makeText(CommentsActivity.this,task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
                }
            }
        });

        fireStore.collection("User Posts/" + postId + "/Comments").addSnapshotListener(new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                if (error == null) {
                    if (!value.isEmpty()) {
                        int count = value.size();
                        if (count == 1){
                            commentCount.setText(count + " comment");
                        }
                        else{
                            commentCount.setText(count + " comments");
                        }
                    }
                }
            }
        });
    }
}