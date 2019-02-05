import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EditorComponent } from './editor/editor.component';
import { SessionCreatorComponent } from './session-creator/session-creator.component';
import { RulesConstructorComponent } from './rules-constructor/rules-constructor.component';
import { DraggableComponent } from './draggable/draggable.component';
import { AboutComponent } from './about/about.component';

// CodeMirror language rules
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/php/php';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EditorComponent,
    SessionCreatorComponent,
    RulesConstructorComponent,
    DraggableComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    CodemirrorModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
