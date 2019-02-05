import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditorComponent} from './editor/editor.component';
import {SessionCreatorComponent} from './session-creator/session-creator.component';
import {AboutComponent} from './about/about.component';

const routes: Routes = [
  { path: '', redirectTo: '/edit', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'edit', component: SessionCreatorComponent },
  { path: 'edit/', component: SessionCreatorComponent },
  { path: 'edit/:connectionId', component: EditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
