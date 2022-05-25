package com.example.socialplusapp.Categories;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.example.socialplusapp.Others.AboutUsActivity;
import com.example.socialplusapp.Adapter.PostAdapter;
import com.example.socialplusapp.Posts.AddPostActivity;
import com.example.socialplusapp.Authentication.LoginActivity;
import com.example.socialplusapp.Profile.EditProfileActivity;
import com.example.socialplusapp.Model.Post;
import com.example.socialplusapp.Model.Users;
import com.example.socialplusapp.R;
import com.example.socialplusapp.Others.SearchActivity;
import com.example.socialplusapp.Profile.UserAccountActivity;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentChange;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.List;

public class OthersCategoryActivity extends AppCompatActivity {

    private FirebaseAuth firebaseAuth;
    private FirebaseFirestore fireStore;
    private Toolbar toolbar;
    private RecyclerView recyclerView;
    private FloatingActionButton fab;
    private Spinner spinner;
    private String selectedCategory;
    private String[] categories = {"Others", "All Posts", "Sports & Outdoors", "Arts & Music", "Games", "Tech", "Pets", "My Posts"};
    private PostAdapter adapter;
    private List<Post> list;
    private List<Users> usersList;
    private Query query;
    private ListenerRegistration listenerRegistration;
    private TextView noPosts, noPosts2, postCount;
    private ImageView empty, search;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_others_category);

        firebaseAuth = FirebaseAuth.getInstance();
        fireStore = FirebaseFirestore.getInstance();
        toolbar = findViewById(R.id.others_toolbar);
        recyclerView = findViewById(R.id.others_recyclerView);
        fab = findViewById(R.id.others_fabBtn);
        spinner = (Spinner) findViewById(R.id.others_spinner);
        postCount = findViewById(R.id.others_postCount);
        noPosts = findViewById(R.id.othersNoPosts);
        noPosts2 = findViewById(R.id.othersNoPosts2);
        empty = findViewById(R.id.others_empty_image);
        search = findViewById(R.id.others_search);
        noPosts.setVisibility(View.INVISIBLE);
        noPosts2.setVisibility(View.INVISIBLE);
        empty.setVisibility(View.INVISIBLE);
        setSupportActionBar(toolbar);
        toolbar.setTitleTextColor(getColor(R.color.orange));
        Drawable icon = ContextCompat.getDrawable(OthersCategoryActivity.this, R.drawable.options);
        toolbar.setOverflowIcon(icon);
        toolbar.setLogo(R.drawable.logo_white);

        list = new ArrayList<>();
        usersList = new ArrayList<>();
        adapter = new PostAdapter(OthersCategoryActivity.this, list, usersList);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new LinearLayoutManager(OthersCategoryActivity.this));
        recyclerView.setAdapter(adapter);

        search.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OthersCategoryActivity.this, SearchActivity.class));
            }
        });

        ArrayAdapter<String> madapter = new ArrayAdapter<String>(this, R.layout.spinner_item, categories);
        madapter.setDropDownViewResource(R.layout.spinner_item_dropdown);
        spinner.setAdapter(madapter);
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selected = parent.getItemAtPosition(position).toString();
                selectedCategory = selected;

                if (selectedCategory == "All Posts") {
                    startActivity(new Intent(OthersCategoryActivity.this, MainActivity.class));
                }
                if (selectedCategory == "Arts & Music") {
                    startActivity(new Intent(OthersCategoryActivity.this, ArtsCategoryActivity.class));
                }
                if (selectedCategory == "Games") {
                    startActivity(new Intent(OthersCategoryActivity.this, GamesCategoryActivity.class));
                }
                if (selectedCategory == "Tech") {
                    startActivity(new Intent(OthersCategoryActivity.this, TechCategoryActivity.class));
                }
                if (selectedCategory == "Pets") {
                    startActivity(new Intent(OthersCategoryActivity.this, PetsCategoryActivity.class));
                }
                if (selectedCategory == "Sports & Outdoors") {
                    startActivity(new Intent(OthersCategoryActivity.this, SportsCategoryActivity.class));
                }
                if (selectedCategory == "My Posts") {
                    startActivity(new Intent(OthersCategoryActivity.this, MyPostsActivity.class));
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OthersCategoryActivity.this, AddPostActivity.class));
            }
        });

        if (firebaseAuth.getCurrentUser() != null) {
            list.clear();
            usersList.clear();
            recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
                @Override
                public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                    super.onScrolled(recyclerView, dx, dy);
                    Boolean isBottom = !recyclerView.canScrollVertically(1);
                    if (isBottom) {
                        Toast.makeText(OthersCategoryActivity.this, "You Have Reached the Bottom", Toast.LENGTH_SHORT).show();
                    }
                }
            });
            query = fireStore.collection("User Posts").whereEqualTo("category", "Others").orderBy("time_posted", Query.Direction.DESCENDING);
            listenerRegistration = query.addSnapshotListener(OthersCategoryActivity.this, new EventListener<QuerySnapshot>() {
                @Override
                public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                    for (DocumentChange doc : value.getDocumentChanges()) {
                        if (doc.getType() == DocumentChange.Type.ADDED) {
                            String postId = doc.getDocument().getId();
                            Post post = doc.getDocument().toObject(Post.class).withId(postId);
                            String postUserId = doc.getDocument().getString("Uid");
                            fireStore.collection("User Profile").document(postUserId).get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                                @Override
                                public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                                    if (task.isSuccessful()) {
                                        Users users = task.getResult().toObject(Users.class);
                                        usersList.add(users);
                                        list.add(post);
                                        adapter.notifyDataSetChanged();
                                    }
                                    else {
                                        Toast.makeText(OthersCategoryActivity.this, task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                }
                            });
                        }
                        else {
                            adapter.notifyDataSetChanged();
                        }
                    }
                    listenerRegistration.remove();
                }
            });
        }
        fireStore.collection("User Posts").whereEqualTo("category", "Others").addSnapshotListener(new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                if (error == null) {
                    int count = value.size();
                    if (count == 0) {
                        postCount.setText("0 Posts");
                        noPosts.setVisibility(View.VISIBLE);
                        noPosts2.setVisibility(View.VISIBLE);
                        empty.setVisibility(View.VISIBLE);
                        recyclerView.setVisibility(View.INVISIBLE);
                    }
                    if (count == 1) {
                        postCount.setText("1 Post");
                    } else {
                        postCount.setText(count + " Posts");
                    }
                }
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        FirebaseUser currentUser = firebaseAuth.getCurrentUser();
        if (currentUser == null) {
            startActivity(new Intent(OthersCategoryActivity.this, LoginActivity.class));
            finish();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {

        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.menu_profile) {
            startActivity(new Intent(OthersCategoryActivity.this, EditProfileActivity.class));
        } else if (item.getItemId() == R.id.menu_logout) {
            firebaseAuth.signOut();
            startActivity(new Intent(OthersCategoryActivity.this, LoginActivity.class));
            finish();
        } else if (item.getItemId() == R.id.menu_account) {
            startActivity(new Intent(OthersCategoryActivity.this, UserAccountActivity.class));
        } else if (item.getItemId() == R.id.menu_about) {
            startActivity(new Intent(OthersCategoryActivity.this, AboutUsActivity.class));
        }
        return true;
    }
}