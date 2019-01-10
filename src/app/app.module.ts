import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {CodemirrorModule} from 'ng2-codemirror';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EditorComponent } from './editor/editor.component';
import { SessionCreatorComponent } from './session-creator/session-creator.component';

// CodeMirror language rules
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/php/php';
import {AngularDraggableModule} from 'angular2-draggable';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EditorComponent,
    SessionCreatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    CodemirrorModule,
    AngularDraggableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
