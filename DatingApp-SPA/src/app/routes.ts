import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';

// creating a path and ascribe a component to it
// needed to add this in imports - app.module (RouterModule)

export const appRoutes: Routes = [
    // ordering is important
    // path to home, needs to be '' not 'home' to avoid display error
    // when user tap new card after some time
{ path: '' , component: HomeComponent },

// we can create one 'dummy path with children to protect few path in one
{
    path: '', // np localhost:4200/members
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
        // adding resolver class to get data before this path will be activate
        // this will save as problem with error when we still waiting for data
        // and path was already activated and can't display correctly content for user
        { path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}  },
        // we need specify route parameter, here 'id'
        // adding MemberDetailResolver class
        // { user: } accessing to data that we get from route
        { path: 'members/:id', component: MemberDetailComponent, resolve: { user: MemberDetailResolver } },
        { path: 'messages' , component: MessagesComponent } ,
        { path: 'lists' , component: ListsComponent},
    ]
},

/** or we can add canActivate: [AuthGuard] to every single path to secure it
{ path: 'members', component: MemberListComponent, canActivate: [AuthGuard] },
{ path: 'messages' , component: MessagesComponent, canActivate: [AuthGuard] } ,
{ path: 'lists' , component: ListsComponent, canActivate: [AuthGuard]  },
 */

// wild card
// match full path url before redirect to home if nothing match to members, messages or lists
{ path: '**' , redirectTo: '', pathMatch: 'full'}

];
