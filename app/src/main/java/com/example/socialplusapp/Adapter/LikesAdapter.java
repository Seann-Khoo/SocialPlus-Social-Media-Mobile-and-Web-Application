package com.example.socialplusapp.Adapter;

import android.app.Activity;
import android.text.format.DateFormat;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.socialplusapp.Model.Likes;
import com.example.socialplusapp.Model.Users;
import com.example.socialplusapp.R;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.Date;
import java.util.List;

import de.hdodenhof.circleimageview.CircleImageView;

public class LikesAdapter extends RecyclerView.Adapter<LikesAdapter.LikesViewHolder> {

    private Activity context;
    private List<Likes> likesList;
    private List<Users> usersList;

    public LikesAdapter(Activity context, List<Likes> likesList, List<Users> usersList){
        this.context = context;
        this.likesList = likesList;
        this.usersList = usersList;
    }

    @NonNull
    @Override
    public LikesAdapter.LikesViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.individual_like,parent,false);
        return new LikesAdapter.LikesViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull LikesAdapter.LikesViewHolder holder, int position) {
        Likes likes = likesList.get(position);

        Users users = usersList.get(position);
        holder.setLikeProfileName(users.getProfile_name());
        holder.setLikeProfileImage(users.getProfile_image());

        long milliseconds = likes.getTimestamp().getTime();
        String date = DateFormat.format("dd MMM yyyy" , new Date(milliseconds)).toString();
        holder.setLikeDatePosted(date);
    }

    @Override
    public int getItemCount() {
        return likesList.size();
    }

    public class LikesViewHolder extends RecyclerView.ViewHolder {

        TextView likeProfileName, likeDatePosted;
        CircleImageView likeProfileImage;
        View mView;

        public LikesViewHolder(@NonNull View itemView) {
            super(itemView);
            mView = itemView;
        }
        public void setLikeDatePosted(String date){
            likeDatePosted = mView.findViewById(R.id.likeDatePosted);
            likeDatePosted.setText(date);
        }
        public void setLikeProfileName(String userName){
            likeProfileName = mView.findViewById(R.id.likeProfileName);
            likeProfileName.setText(userName);
        }
        public void setLikeProfileImage(String profileImage){
            likeProfileImage = mView.findViewById(R.id.likeProfileImage);
            Glide.with(context).load(profileImage).into(likeProfileImage);
        }
    }
}
