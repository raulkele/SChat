import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SchatComponent } from './components/schat/schat.component';
import { FormsModule } from '@angular/forms';
import { SChatService } from './_service/schat.service';

@NgModule({
  declarations: [
    AppComponent,
    SchatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [SChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
