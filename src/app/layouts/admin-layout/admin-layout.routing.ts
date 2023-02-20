import { Routes } from "@angular/router";
import { IconsComponent } from "../../pages/icons/icons.component";


export const AdminLayoutRoutes: Routes = [
  {
    path: "chat", component: IconsComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: ':id',
        component: IconsComponent
      }
    ]
  },
];
