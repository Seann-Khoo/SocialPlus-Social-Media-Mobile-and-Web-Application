package com.example.socialplusapp.Adapter;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.text.format.DateFormat;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.socialplusapp.Posts.CommentsActivity;
import com.example.socialplusapp.Posts.EditPostActivity;
import com.example.socialplusapp.Posts.LikesActivity;
import com.example.socialplusapp.Model.Post;
import com.example.socialplusapp.Model.Users;
import com.example.socialplusapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import de.hdodenhof.circleimageview.CircleImageView;

public class PostAdapter extends RecyclerView.Adapter<PostAdapter.PostViewHolder> {

    private List<Post> mList;
    private List<Users> usersList;
    private Activity context;
    private FirebaseFirestore fireStore;
    private FirebaseAuth auth;

    public PostAdapter(Activity context , List<Post> mList, List<Users> usersList){
        this.mList = mList;
        this.context = context;
        this.usersList = usersList;
    }

    @NonNull
    @Override
    public PostViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.individual_post , parent , false);
        auth = FirebaseAuth.getInstance();
        fireStore = FirebaseFirestore.getInstance();
        return new PostViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull PostViewHolder holder, int position) {

        holder.setIsRecyclable(false);
        Post post = mList.get(position);
        holder.setPost_image(post.getPost_image());
        holder.setPost_caption(post.getPost_caption());
        holder.setCategory(post.getCategory());

        long milliseconds = post.getTime_posted().getTime();
        String date = DateFormat.format("dd MMM yyyy" , new Date(milliseconds)).toString();
        holder.setTime_posted(date);

        Users users = usersList.get(position);
        holder.setProfile_name(users.getProfile_name());
        holder.setProfile_image(users.getProfile_image());

        String postId = post.PostId;
        String currentUserId = auth.getCurrentUser().getUid();

        holder.likeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                fireStore.collection("User Posts/" + postId + "/Likes").document(currentUserId).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                        if (!task.getResult().exists()){
                            Map<String , Object> likesMap = new HashMap<>();
                            likesMap.put("Uid", currentUserId);
                            likesMap.put("postId", postId);
                            likesMap.put("timestamp" , FieldValue.serverTimestamp());
                            fireStore.collection("User Posts/" + postId + "/Likes").document(currentUserId).set(likesMap);
                        }else{
                            fireStore.collection("User Posts/" + postId + "/Likes").document(currentUserId).delete();
                        }
                    }
                });
            }
        });
        fireStore.collection("User Posts/" + postId + "/Likes").document(currentUserId).addSnapshotListener(new EventListener<DocumentSnapshot>() {
            @Override
            public void onEvent(@Nullable DocumentSnapshot value, @Nullable FirebaseFirestoreException error) {
                if (error == null) {
                    if (value.exists()) {
                        holder.likeBtn.setImageDrawable(context.getDrawable(R.drawable.heart_liked));
                    } else {
                        holder.likeBtn.setImageDrawable(context.getDrawable(R.drawable.heart));
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
                        holder.setLike_count(count);
                    } else {
                        holder.setLike_count(0);
                    }
                }
            }
        });

        fireStore.collection("User Posts/" + postId + "/Comments").addSnapshotListener(new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                if (error == null) {
                    if (!value.isEmpty()) {
                        int mcount = value.size();
                        holder.setComment_count(mcount);
                    } else {
                        holder.setComment_count(0);
                    }
                }
            }
        });

        holder.commentBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent commentIntent = new Intent(context, CommentsActivity.class);
                commentIntent.putExtra("postid",postId);
                context.startActivity(commentIntent);
            }
        });

        holder.likeCount.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent likeIntent = new Intent(context, LikesActivity.class);
                likeIntent.putExtra("postID", postId);
                context.startActivity(likeIntent);
            }
        });

        if(currentUserId.equals(post.getUid())){
            holder.deleteBtn.setVisibility(View.VISIBLE);
            holder.deleteBtn.setClickable(true);
            holder.deleteBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    AlertDialog.Builder alert = new AlertDialog.Builder(context);
                    alert.setTitle("Delete Post").setMessage("Are you sure you want to delete this post?").setNegativeButton("No",null).setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            fireStore.collection("User Posts/" + postId + "/Comments").get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                @Override
                                public void onComplete(@NonNull Task<QuerySnapshot> task) {
                                    for(QueryDocumentSnapshot snapshot : task.getResult()){
                                        fireStore.collection("User Posts/" + postId + "/Comments").document(snapshot.getId()).delete();
                                    }
                                }
                            });
                            fireStore.collection("User Posts/" + postId + "/Likes").get().addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                @Override
                                public void onComplete(@NonNull Task<QuerySnapshot> task) {
                                    for(QueryDocumentSnapshot snapshot : task.getResult()){
                                        fireStore.collection("User Posts/" + postId + "/Likes").document(snapshot.getId()).delete();
                                    }
                                }
                            });
                            fireStore.collection("User Posts").document(postId).delete();
                            Toast.makeText(context, "Post Deleted", Toast.LENGTH_SHORT).show();
                            mList.remove(position);
                            notifyDataSetChanged();
                        }
                    });
                    alert.show();
                }
            });
        }
        if(currentUserId.equals(post.getUid())){
            holder.editBtn.setVisibility(View.VISIBLE);
            holder.editBtn.setClickable(true);
            holder.editBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent editIntent = new Intent(context, EditPostActivity.class);
                    editIntent.putExtra("PostID", postId);
                    context.startActivity(editIntent);
                }
            });
        }
    }

    @Override
    public int getItemCount() {
        return mList.size();
    }

    public class PostViewHolder extends RecyclerView.ViewHolder{
        View mView;
        ImageView postImage, likeBtn, commentBtn;
        CircleImageView profileImage;
        TextView profileName, datePosted, captionTV, likeCount, categoryTV, commentCount;
        ImageButton deleteBtn, editBtn;
        public PostViewHolder(@NonNull View itemView) {
            super(itemView);
            mView = itemView;
            likeBtn = mView.findViewById(R.id.likeBtn);
            commentBtn = mView.findViewById(R.id.commentBtn);
            deleteBtn = mView.findViewById(R.id.deleteBtn);
            editBtn = mView.findViewById(R.id.editBtn);
            likeCount = mView.findViewById(R.id.likeCount);
        }

        public void setLike_count(int count){
            likeCount = mView.findViewById(R.id.likeCount);
            if (count == 1){
                likeCount.setText(count + " like");
            }
            else{
                likeCount.setText(count + " likes");
            }
        }
        public void setComment_count(int count){
            commentCount = mView.findViewById(R.id.commentCount);
            if (count == 1){
                commentCount.setText(count + " comment");
            }
            else{
                commentCount.setText(count + " comments");
            }
        }
        public void setProfile_name(String userName){
            profileName = mView.findViewById(R.id.profileNameTV);
            profileName.setText(userName);
        }
        public void setTime_posted(String date){
            datePosted = mView.findViewById(R.id.datePosted);
            datePosted.setText(date);
        }
        public void setPost_image(String image){
            postImage = mView.findViewById(R.id.post_image);
            Glide.with(context).load(image).into(postImage);
        }
        public void setProfile_image(String profile){
            profileImage = mView.findViewById(R.id.profile_image);
            Glide.with(context).load(profile).into(profileImage);
        }
        public void setPost_caption(String caption){
            captionTV = mView.findViewById(R.id.captionTV);
            captionTV.setText(caption);
        }
        public void setCategory(String category){
            categoryTV = mView.findViewById(R.id.categoryTV);
            categoryTV.setText(category);
        }
    }
}