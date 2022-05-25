package com.example.socialplusapp.Adapter;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.socialplusapp.Model.Comments;
import com.example.socialplusapp.Model.Users;
import com.example.socialplusapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.List;

import de.hdodenhof.circleimageview.CircleImageView;

public class CommentsAdapter extends RecyclerView.Adapter<CommentsAdapter.CommentsViewHolder> {

    private Activity context;
    private List<Comments> commentsList;
    private List<Users> usersList;
    private FirebaseFirestore fireStore;
    private FirebaseAuth auth;

    public CommentsAdapter(Activity context, List<Comments> commentsList, List<Users> usersList){
        this.context = context;
        this.commentsList = commentsList;
        this.usersList = usersList;
    }

    @NonNull
    @Override
    public CommentsViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.individual_comment,parent,false);
        auth = FirebaseAuth.getInstance();
        fireStore = FirebaseFirestore.getInstance();
        return new CommentsViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CommentsViewHolder holder, int position) {
        Comments comments = commentsList.get(position);
        holder.setComment(comments.getComment());

        Users users = usersList.get(position);
        holder.setCommentProfileName(users.getProfile_name());
        holder.setCommentProfileImage(users.getProfile_image());

        String commentId = commentsList.get(position).getCommentId();
        String postId = commentsList.get(position).getPostId();
        String currentUserId = auth.getCurrentUser().getUid();
        if(currentUserId.equals(comments.getUid())){
            holder.commentDeleteBtn.setVisibility(View.VISIBLE);
            holder.commentDeleteBtn.setClickable(true);
            holder.commentDeleteBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    AlertDialog.Builder alert = new AlertDialog.Builder(context);
                    alert.setTitle("Delete Comment").setMessage("Are you sure you want to delete this comment?").setNegativeButton("No",null).setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            fireStore.collection("User Posts/" + postId + "/Comments").document(commentId).delete().addOnCompleteListener(new OnCompleteListener<Void>() {
                                @Override
                                public void onComplete(@NonNull Task<Void> task) {
                                    if(task.isSuccessful()){
                                        Toast.makeText(context, "Comment Deleted", Toast.LENGTH_SHORT).show();
                                        commentsList.remove(position);
                                        notifyDataSetChanged();
                                    }
                                    else{
                                        Toast.makeText(context,task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                }
                            });
                        }
                    });
                    alert.show();
                }
            });
        }
    }

    @Override
    public int getItemCount() {
        return commentsList.size();
    }

    public class CommentsViewHolder extends RecyclerView.ViewHolder {

        TextView commentTV, commentProfileName;
        CircleImageView commentProfileImage;
        ImageButton commentDeleteBtn;
        View mView;

        public CommentsViewHolder(@NonNull View itemView) {
            super(itemView);
            mView = itemView;
            commentDeleteBtn = mView.findViewById(R.id.commentDeleteBtn);
        }
        public void setComment(String comment){
            commentTV = mView.findViewById(R.id.commentTV);
            commentTV.setText(comment);
        }
        public void setCommentProfileName(String userName){
            commentProfileName = mView.findViewById(R.id.commentProfileName);
            commentProfileName.setText(userName);
        }
        public void setCommentProfileImage(String profileImage){
            commentProfileImage = mView.findViewById(R.id.commentProfileImage);
            Glide.with(context).load(profileImage).into(commentProfileImage);
        }
    }
}
