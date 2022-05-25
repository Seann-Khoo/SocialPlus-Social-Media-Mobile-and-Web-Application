package com.example.socialplusapp.Others;

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
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.example.socialplusapp.Adapter.PostAdapter;
import com.example.socialplusapp.Authentication.LoginActivity;
import com.example.socialplusapp.Model.Post;
import com.example.socialplusapp.Model.Users;
import com.example.socialplusapp.Posts.AddPostActivity;
import com.example.socialplusapp.Profile.EditProfileActivity;
import com.example.socialplusapp.Profile.UserAccountActivity;
import com.example.socialplusapp.R;
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

public class SearchActivity extends AppCompatActivity {

    private FirebaseAuth firebaseAuth;
    private FirebaseFirestore fireStore;
    private Toolbar searchToolbar;
    private RecyclerView recyclerView;
    private FloatingActionButton fab;
    private PostAdapter adapter;
    private List<Post> list;
    private List<Users> usersList;
    private Query query;
    private ListenerRegistration listenerRegistration;
    private TextView noResults, noResults2, searchText, searchText2;
    private ImageView empty, searchImage;
    private Button searchBtn;
    private EditText searchBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        firebaseAuth = FirebaseAuth.getInstance();
        fireStore = FirebaseFirestore.getInstance();
        searchToolbar = findViewById(R.id.search_toolbar);
        recyclerView = findViewById(R.id.search_recyclerView);
        fab = findViewById(R.id.search_fabBtn);
        searchBtn = findViewById(R.id.searchBtn);
        searchBar = findViewById(R.id.searchET);
        noResults = findViewById(R.id.searchNoResults);
        noResults2 = findViewById(R.id.searchNoResults2);
        searchText = findViewById(R.id.searchText);
        searchText2 = findViewById(R.id.searchText2);
        empty = findViewById(R.id.search_empty_image);
        searchImage = findViewById(R.id.search_image);
        noResults.setVisibility(View.INVISIBLE);
        noResults2.setVisibility(View.INVISIBLE);
        empty.setVisibility(View.INVISIBLE);
        setSupportActionBar(searchToolbar);
        searchToolbar.setTitleTextColor(getColor(R.color.orange));
        Drawable icon = ContextCompat.getDrawable(SearchActivity.this,R.drawable.options);
        searchToolbar.setOverflowIcon(icon);
        searchToolbar.setLogo(R.drawable.logo_white);

        list = new ArrayList<>();
        usersList = new ArrayList<>();
        adapter = new PostAdapter(SearchActivity.this, list, usersList);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new LinearLayoutManager(SearchActivity.this));
        recyclerView.setAdapter(adapter);
        recyclerView.setVisibility(View.INVISIBLE);

        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(SearchActivity.this, AddPostActivity.class));
            }
        });

        searchBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                searchText.setVisibility(View.INVISIBLE);
                searchText2.setVisibility(View.INVISIBLE);
                searchImage.setVisibility(View.INVISIBLE);
                list.clear();
                usersList.clear();
                recyclerView.setVisibility(View.INVISIBLE);
                noResults.setVisibility(View.INVISIBLE);
                noResults2.setVisibility(View.INVISIBLE);
                empty.setVisibility(View.INVISIBLE);
                String search = searchBar.getText().toString();

                if (search.isEmpty() || search.equals(" ")) {
                    Toast.makeText(SearchActivity.this, "Please Insert Search Query", Toast.LENGTH_SHORT).show();
                }
                else {
                    if (firebaseAuth.getCurrentUser() != null) {
                        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
                            @Override
                            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                                super.onScrolled(recyclerView, dx, dy);
                                Boolean isBottom = !recyclerView.canScrollVertically(1);
                                if (isBottom) {
                                    Toast.makeText(SearchActivity.this, "No More Results to Show :(", Toast.LENGTH_SHORT).show();
                                }
                            }
                        });
                        query = fireStore.collection("User Posts").whereEqualTo("user", search).orderBy("time_posted", Query.Direction.DESCENDING);
                        listenerRegistration = query.addSnapshotListener(SearchActivity.this, new EventListener<QuerySnapshot>() {
                            @Override
                            public void onEvent(@Nullable QuerySnapshot value, @Nullable FirebaseFirestoreException error) {
                                if (value.isEmpty()) {
                                    noResults.setVisibility(View.VISIBLE);
                                    noResults2.setVisibility(View.VISIBLE);
                                    empty.setVisibility(View.VISIBLE);
                                } else {
                                    recyclerView.setVisibility(View.VISIBLE);
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
                                                    } else {
                                                        Toast.makeText(SearchActivity.this, task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                                                    }
                                                }
                                            });
                                        } else {
                                            adapter.notifyDataSetChanged();
                                        }
                                    }
                                    listenerRegistration.remove();
                                }
                            }
                        });
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
            startActivity(new Intent(SearchActivity.this, LoginActivity.class));
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
            startActivity(new Intent(SearchActivity.this, EditProfileActivity.class));
        }
        else if(item.getItemId() == R.id.menu_logout){
            firebaseAuth.signOut();
            startActivity(new Intent(SearchActivity.this,LoginActivity.class));
            finish();
        }
        else if(item.getItemId() == R.id.menu_account){
            startActivity(new Intent(SearchActivity.this, UserAccountActivity.class));
        }
        else if(item.getItemId() == R.id.menu_about){
            startActivity(new Intent(SearchActivity.this, AboutUsActivity.class));
        }
        return true;
    }
}