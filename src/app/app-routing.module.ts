import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'edit-post/:id',
    loadChildren: () => import('./edit-post/edit-post.module').then( m => m.EditPostPageModule)
  },
  {
    path: 'add-post',
    loadChildren: () => import('./add-post/add-post.module').then( m => m.AddPostPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'add-profile',
    loadChildren: () => import('./add-profile/add-profile.module').then( m => m.AddProfilePageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'favourites',
    loadChildren: () => import('./favourites/favourites.module').then( m => m.FavouritesPageModule)
  },
  {
    path: 'post-individual/:id',
    loadChildren: () => import('./post-individual/post-individual.module').then( m => m.PostIndividualPageModule)
  },
  {
    path: 'section',
    loadChildren: () => import('./section/section.module').then( m => m.SectionPageModule)
  },
  {
    path: 'marketplace',
    loadChildren: () => import('./marketplace/marketplace.module').then( m => m.MarketplacePageModule)
  },
  {
    path: 'marketplace-individual/:id',
    loadChildren: () => import('./marketplace-individual/marketplace-individual.module').then( m => m.MarketplaceIndividualPageModule)
  },
  {
    path: 'wishlist',
    loadChildren: () => import('./wishlist/wishlist.module').then( m => m.WishlistPageModule)
  },
  {
    path: 'add-product',
    loadChildren: () => import('./add-product/add-product.module').then( m => m.AddProductPageModule)
  },
  {
    path: 'edit-product/:id',
    loadChildren: () => import('./edit-product/edit-product.module').then( m => m.EditProductPageModule)
  },
  {
    path: 'post-option',
    loadChildren: () => import('./post-option/post-option.module').then( m => m.PostOptionPageModule)
  },
  {
    path: 'phone-login',
    loadChildren: () => import('./phone-login/phone-login.module').then( m => m.PhoneLoginPageModule)
  },
  {
    path: 'phone-register',
    loadChildren: () => import('./phone-register/phone-register.module').then( m => m.PhoneRegisterPageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'arts',
    loadChildren: () => import('./arts/arts.module').then( m => m.ArtsPageModule)
  },
  {
    path: 'sports',
    loadChildren: () => import('./sports/sports.module').then( m => m.SportsPageModule)
  },
  {
    path: 'tech',
    loadChildren: () => import('./tech/tech.module').then( m => m.TechPageModule)
  },
  {
    path: 'games',
    loadChildren: () => import('./games/games.module').then( m => m.GamesPageModule)
  },
  {
    path: 'pets',
    loadChildren: () => import('./pets/pets.module').then( m => m.PetsPageModule)
  },
  {
    path: 'others',
    loadChildren: () => import('./others/others.module').then( m => m.OthersPageModule)
  },
  {
    path: 'my-posts',
    loadChildren: () => import('./my-posts/my-posts.module').then( m => m.MyPostsPageModule)
  },
  {
    path: 'update-password',
    loadChildren: () => import('./update-password/update-password.module').then( m => m.UpdatePasswordPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'marketplace-search',
    loadChildren: () => import('./marketplace-search/marketplace-search.module').then( m => m.MarketplaceSearchPageModule)
  },
  {
    path: 'my-listings',
    loadChildren: () => import('./my-listings/my-listings.module').then( m => m.MyListingsPageModule)
  },
  {
    path: 'listing-category',
    loadChildren: () => import('./listing-category/listing-category.module').then( m => m.ListingCategoryPageModule)
  },
  {
    path: 'user-posts',
    loadChildren: () => import('./user-posts/user-posts.module').then( m => m.UserPostsPageModule)
  },
  {
    path: 'user-listings',
    loadChildren: () => import('./user-listings/user-listings.module').then( m => m.UserListingsPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
