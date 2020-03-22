import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { OlMapComponent } from './ol-map/ol-map.component';
import { MainformComponent } from './mainform/mainform.component';
import { MaintableComponent } from './maintable/maintable.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  },
  // {
  //   path: '**',
  //   redirectTo: 'map'
  // },
  {
    path: 'app',
    component: AppComponent
  },
  {
    path: 'map',
    component: OlMapComponent
  },
  {
    path: 'mainform',
    component: MainformComponent,
  },
  {
    path: 'maintable',
    component: MaintableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
